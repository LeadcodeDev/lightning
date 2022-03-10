import { InlineConfig, ViteDevServer, createServer, Logger } from 'vite'
import { LightningEvents, LightningWatcher } from '../types'
import path, { join } from 'node:path'
import Supervisor from '../supervisor'
import { build, BuildOptions } from 'esbuild'
import { EventEmitter } from 'node:events'
import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { fetch } from 'fs-recursive'

export default class DevServer extends EventEmitter{
  public viteServer?: ViteDevServer
  private supervisor?: Supervisor
  private root: string | undefined
  public files: string[] = []
  private tmp: string | undefined
  private buildOptions: BuildOptions | undefined
  private ignoreFiles: string[] = []
  private ignoreFolders: string[] = []

  constructor (private logger: Logger) {
    super()
  }

  private async makeTemporaryWorkspace () {
    try {
      this.tmp = await mkdtemp(join(tmpdir(), 'lightning-server'))
    } catch (err) {
      throw new Error('Cannot create temporary folder')
    }
  }

  public async createServer (options?: InlineConfig, buildOptions?: BuildOptions) {
    this.root = options?.root
    this.buildOptions = buildOptions
    this.logger.clearScreen('info')
    await this.makeTemporaryWorkspace()
    this.viteServer = await createServer(options)

    return this
  }

  public async listen (printUrls: boolean = false) {
    await this.viteServer?.listen()
    if (printUrls) {
      this.viteServer?.printUrls()
    }
  }

  public async watch (options: LightningWatcher) {
    this.ignoreFiles = options.ignoreFiles
    this.ignoreFolders = options.ignoreFolders

    this.files = await this.fetchFilesFromRoot()
    this.viteServer?.watcher.add(this.files)

    this.viteServer?.watcher.on('ready', async () => await this.ready())
    this.viteServer?.watcher.on('add', async (args) => await this.addFile(args))
    this.viteServer?.watcher.on('unlink', async (args) => await this.removeFile(args))
    this.viteServer?.watcher.on('change', async (args) => await this.changeFile(args))
    this.viteServer?.watcher.on('error', () => console.log('ff'))

    // const rootFolder = this.root?.includes(path.sep)
    //   ? this.root.split(path.sep).at(-1)
    //   : this.root!.split('/').at(-1)

    const location = join(this.tmp!, options.entryPoint.replace(/\.ts/g, '.js'))
    this.supervisor = new Supervisor(location, '--commands')
  }

  private async fetchFilesFromRoot (): Promise<string[]> {
    const files = await fetch(
      this.root!,
      ['ts'],
      'utf-8',
      ['node_modules', '.git', ...this.ignoreFolders]
    )

    return Array.from(files).map(([, file]) => {
      if (file.filename.endsWith('.d') || this.ignoreFiles.includes(file.filename)) {
        return
      }
      return file.path
    }).filter((path) => path) as string[]
  }

  private async ready () {
    await this.track()
    this.emit('ready:watch')
  }

  private async addFile (filePath: string) {
    this.files.push(filePath)
    await this.track(true)

    this.emit('add:file', filePath)
  }

  private async removeFile (filePath: string) {
    const index = this.files.findIndex((location) => location === filePath)
    this.files.splice(index, 1)
    await this.track(true)

    this.emit('remove:file', filePath)
  }

  private async changeFile (filePath) {
    await this.track(true)

    this.emit('update:file', filePath)
  }

  private async track (withClearConsole: boolean = false) {
    await this.build()

    if (withClearConsole) {
      this.logger.clearScreen('info')
    }

    await this.supervisor?.restart()
  }

  private async build () {
    return build({
      ...this.buildOptions,
      entryPoints: this.files,
      outdir: this.tmp,
      platform: 'node',
      format: 'cjs'
    })
  }

  public on<Event extends keyof LightningEvents> (event: Event, listener: (...args: LightningEvents[Event]) => Awaited<void>): this
  public on<Event extends string | symbol> (event: Exclude<Event, keyof LightningEvents>, listener: (...args: LightningEvents[]) => Awaited<void>): this {
    super.on(event, listener)
    return this
  }

  public emit<Event extends keyof LightningEvents> (event: Event, ...args: LightningEvents[Event])
  public emit<Event extends string | symbol> (event: Exclude<Event, keyof LightningEvents>, ...args: unknown[]) {
    super.emit(event, ...args)
  }
}