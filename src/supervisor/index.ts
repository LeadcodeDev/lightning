import { ChildProcess, exec } from 'child_process'

export default class Supervisor {
  public runner: ChildProcess | undefined
  private readonly args: string[]

  constructor (private entryPoint: string, ...args: string[]) {
    this.args = args
  }

  public async start () {
    this.runner = await exec(`node ${this.entryPoint} ${this.args?.join(' ')}`)
    this.runner?.stdout?.pipe(process.stdout)
    this.runner.stderr?.pipe(process.stderr)

    if (this.args.includes('--interaction')) {}
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