import { FSWatcher, watch } from 'chokidar'
import { WatcherState } from '../types'

export default class Watcher {
  public monitor: FSWatcher
  public files: string[] = []
  public state: WatcherState = 'STARTING'

  constructor (entries) {
    this.state = 'STARTING'
    this.monitor = watch(entries, {
      persistent: true,
      followSymlinks: true,
    })

    this.state = 'FETCHING_FILES'
    this.monitor.on('add', (path: string) => this.files.push(path))
    this.monitor.on('unlink', (path: string) => this.removePath(path))
    this.monitor.on('unlinkDir', (path: string) => this.removePath(path))
    this.monitor.on('ready', () => {
      this.state = 'READY'
    })
  }

  private removePath (path) {
    const index = this.files.indexOf(path)
    this.files.splice(index, 1)
  }
}