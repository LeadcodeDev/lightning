import { EventEmitter } from 'node:events'
import { createLogger, Logger } from 'vite'
import { build, BuildOptions } from 'esbuild'
import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { exec } from 'child_process'
import DevServer from './DevServer'

export default class Lightning extends EventEmitter {
  public logger: Logger = createLogger()
  public tmp!: string
  public devServer: DevServer = new DevServer(this.logger)

  private async makeTemporaryWorkspace () {
    try {
      this.tmp = await mkdtemp(join(tmpdir(), 'lightning-server'))
    } catch (err) {
      throw new Error('Cannot create temporary folder')
    }
  }

  public async execFile (entryPoint: string, clearConsole: boolean = false, options?: BuildOptions) {
    await this.makeTemporaryWorkspace()
    const file = join(this.tmp, 'index.js')

    if (clearConsole) {
      this.logger.clearScreen('info')
    }

    await build({
      ...options,
      entryPoints: [entryPoint],
      outfile: file,
      platform: 'node',
      bundle: true,
      format: 'cjs'
    })

    const { stdout, stderr } = await exec(`node ${file}`)
    stdout?.pipe(process.stdout)
    stderr?.pipe(process.stderr)
  }
}