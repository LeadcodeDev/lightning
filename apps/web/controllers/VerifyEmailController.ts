import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import Token from "Domains/users/models/Token";

export default class VerifyEmailController {
  public async index ({ view }: HttpContextContract): Promise<string> {
    return view.render('web::views/verify')
  }

  public async verify ({ response, session, params, auth }: HttpContextContract): Promise<void> {
    const user = await Token.getUserToken(params.token, 'VERIFY_EMAIL')

    if (!user) {
      session.flash('token', 'Your token is invalid or expired')
      return response.redirect().toRoute('verify.email')
    }

    user.hasEmailVerified = true
    await user.save()
    await Token.expireTokens(user, 'verifyEmailTokens')

    await auth.login(user)

    return response.redirect().toRoute('/')
  }
}
