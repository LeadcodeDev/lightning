import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from "Domains/users/models/User";
import Token from "Domains/users/models/Token";
import Route from "@ioc:Adonis/Core/Route";
import Env from "@ioc:Adonis/Core/Env";
import UserValidator from "Apps/web/validators/UserValidator";
import ActiveAccount from "Apps/web/mails/ActiveAccount";
import DefaultEmailSettings from "App/Mailers/DefaultEmailSettings";

export default class UserController {
  public async create ({ view }: HttpContextContract): Promise<string>{
    return view.render('web::views/authentication/create_user')
  }

  public async store ({ request, response, i18n }: HttpContextContract) {
    const data = await request.validate(UserValidator)

    const user = await User.create(data)
    const token = await Token.generateVerifyEmailToken(user)
    const activeEmailLink = Route.makeUrl('verify.email.verify', [token])

    const emailSettings = await new DefaultEmailSettings().get()
    const email = new ActiveAccount(
      emailSettings,
      user,
      Env.get('DOMAIN') + activeEmailLink,
      i18n.formatMessage('emails.active_account.subject')
    )

    await email.sendLater()

    return response.redirect().toRoute('verify.email')
  }
}
