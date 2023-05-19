import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import LoginValidator from "Apps/web/validators/authentication/LoginValidator";

export default class AuthenticationController {
  public async showLogin ({ view }: HttpContextContract): Promise<string>{
    return view.render('web::views/authentication/login')
  }

  public async login ({ request, response, auth, session, i18n }: HttpContextContract) {
    const { email, password } = await request.validate(LoginValidator)

    try {
      await auth.use('web').attempt(email, password)
      response.redirect('/')
    } catch {
      session.flash('error', i18n.formatMessage('authentication.errors.bad_credentials'))
      return response.redirect().back()
    }
  }

  public async logout ({ response, auth }: HttpContextContract) {
    await auth.logout()
    return response.redirect().back()
  }
}
