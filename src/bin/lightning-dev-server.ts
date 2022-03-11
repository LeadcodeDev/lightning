import { sep } from 'node:path'
import Lightning from '../lightning'

(async () => {
  const [,, ...args] = process.argv
  const [entryPoint] = args

  const entry = entryPoint.includes(sep)
    ? entryPoint.split(sep)
    : entryPoint.split('/')

  if (!entry) {
    return
  }

  const lightningServer = new Lightning()
  const server = lightningServer.createDevServer()
  await server.watch({
    root: entry.splice(0, entry.length - 1).join(sep),
    entryPoint: 'index.ts',
    clearScreenChange: true,
    withDurationBuild: true
  })
})()