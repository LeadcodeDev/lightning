import { ChildProcess, exec } from 'child_process'
import { join } from 'node:path'
import { DateTime } from 'luxon'
import DevServer from '../lightning/DevServer'

export default class Supervisor {
  public runner: ChildProcess | undefined
  private buildStart?: DateTime
  private readonly args: string[]

  constructor (
    private devServer: DevServer,
    ...args: string[]
  ) {
    this.args = args
    this.devServer.on('start:build', (time: DateTime) => this.buildStart = time)
  }

  public async start () {
    const entryPoint = join(this.devServer.tmp!, this.devServer.watchOptions.entryPoint.replace(/\.ts/, '.js'))
    this.runner = await exec(`node ${entryPoint} ${this.args?.join(' ')}`)

    this.runner?.stdout?.pipe(process.stdout)
    this.runner.stderr?.pipe(process.stderr)

    this.devServer.emit('process:duration', DateTime.now().diff(this.buildStart!))
  }

  public withInteraction () {
    process.stdin.on('data', (data: Buffer) => {
      this.runner?.stdin?.write(data.toString())
    })
  }

  public async restart () {
    this.runner?.kill('SIGTERM')
    await this.start()
  }
}