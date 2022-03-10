import Lightning from '../lightning'

(async () => {
  const [,, ...args] = process.argv
  const [entryPoint] = args

  const lightningServer = new Lightning()
  await lightningServer.execFile(entryPoint)
})()