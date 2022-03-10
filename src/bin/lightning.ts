(async () => {
  const [,, ...args] = process.argv

  if (args.includes('--watch')) {
    await import('./lightning-dev-server')
    return
  }

  await import('./lightning-transpile')
})()
