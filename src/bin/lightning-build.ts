import Lightning from '../lightning'

(async () => {
  const [,, ...args] = process.argv
  const [entryPoint] = args

  const lightningServer = new Lightning()
  // @Todo Ajouter les settings par défaut de la compilation
  // await lightningServer.execFile(entryPoint)
})()