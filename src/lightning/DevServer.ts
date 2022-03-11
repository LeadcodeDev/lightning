import { LightningEvents, LightningWatcher } from '../types'
import { join } from 'node:path'
import Supervisor from '../supervisor'
import { build, BuildOptions } from 'esbuild'
import { EventEmitter } from 'node:events'
import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import Watcher from '../watcher'
import Logger from '../logger'
import { DateTime, Duration } from 'luxon'

export default class DevServer extends EventEmitter {
  private supervisor?: Supervisor
  public watcher?: Watcher
  public logger: Logger = new Logger()
  public root?: string
  public tmp?: string
  public buildOptions?: BuildOptions
  public watchOptions!: LightningWatcher

  private async makeTemporaryWorkspace () {
    try {
      this.tmp = await mkdtemp(join(tmpdir(), 'lightning-server'))
    } catch (err) {
      throw new Error('Cannot create temporary folder')
    }
  }

  public async watch (options: LightningWatcher) {
    this.watchOptions = options

    this.watcher = new Watcher(this.watchOptions.root)

    if (options.clearScreenChange) {
      this.logger.clearScreen()
    }

    await this.makeTemporaryWorkspace()

    this.watcher.monitor.on('ready', async () => await this.ready())
    this.watcher.monitor.on('add', async (args) => await this.addFile(args))
    this.watcher.monitor.on('unlink', async (args) => await this.removeFile(args))
    this.watcher.monitor.on('change', async (args) => await this.changeFile(args))
    this.watcher.monitor.on('error', (err: Error) => this.error(err))

    if (this.watchOptions.withDurationBuild) {
      this.on('process:duration', (time: Duration) => {
        console.log(time.toMillis())
      })
    }

    if (!this.tmp) {
      throw Error('Temporary folder not exist.')
    }

    this.supervisor = new Supervisor(this,'--commands')
  }

  private async ready () {
    await this.track()
    this.emit('ready:watch')
  }

  private async addFile (filePath: string) {
    if (this.watcher?.state === 'READY') {
      await this.track(true)
      this.emit('add:file', filePath)
    }
  }

  private async removeFile (filePath: string) {
    if (this.watcher?.state === 'READY') {
      await this.track(true)
      this.emit('remove:file', filePath)
    }
  }

  private async changeFile (filePath) {
    if (this.watcher?.state === 'READY') {
      await this.track(true)
      this.emit('update:file', filePath)
    }
  }

  protected error (error: Error) {
    console.log('error', error.stack)
  }

  private async track (withClearConsole: boolean = false) {
    if (withClearConsole && this.watchOptions.clearScreenChange) {
      this.logger.clearScreen()
    }

    await this.build()
    await this.supervisor?.restart()
  }

  private async build () {
    this.emit('start:build', DateTime.now())
    return build({
      ...this.buildOptions,
      entryPoints: this.watcher?.files,
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