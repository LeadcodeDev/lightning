(async () => {
  const [,,, mode] = process.argv

  const modes = {
    '--watch': () => import('./lightning-dev-server'),
    '--build': () => import('./lightning-build')
  }

  if (mode in modes) {
    await modes[mode]()
    return
  }

  await import('./lightning-transpile')
})()
