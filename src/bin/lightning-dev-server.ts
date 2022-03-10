import { sep } from 'node:path'
import Lightning from '../lightning'

(async () => {
  const [,, ...args] = process.argv
  const [entryPoint] = args

  const entry = entryPoint.includes(sep)
    ? entryPoint.split(sep)
    : entryPoint.split('/')

  const rootLocation = entry.splice(0, entry.length - 1).join(sep)
  const entryFile = entry.at(-1)

  if (!entryFile) {
    return
  }

  const lightningServer = new Lightning()
  const server = await lightningServer.devServer.createServer({
    configFile: false,
    root: rootLocation,
    server: { port: 4000 },
    clearScreen: true,
  })

  await server.watch({
    entryPoint: entryFile,
    ignoreFiles: ['vitest.config'],
    ignoreFolders: ['build', 'tests'],
    clearScreenWhenRestart: true
  })

  await server.listen(true)

  server.on('update:file', (file) => {
    lightningServer.logger.info('[Reload] ' + file)
  })
})()