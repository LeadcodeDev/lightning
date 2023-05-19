import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ManagerGuard {
  public async handle({ bouncer }: HttpContextContract, next: () => Promise<void>) {
    await bouncer
      .with('ManagerPolicy')
      .authorize('viewDashboard')

    await next()
  }
}
