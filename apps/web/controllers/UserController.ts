import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from "Domains/users/models/User";
import Token from "Domains/users/models/Token";
import Mail from "@ioc:Adonis/Addons/Mail";
import Route from "@ioc:Adonis/Core/Route";
import Env from "@ioc:Adonis/Core/Env";
import UserValidator from "Apps/web/validators/UserValidator";

export default class UserController {
  public async create ({ view }: HttpContextContract): Promise<string>{
    return view.render('web::views/authentication/create_user')
  }

  public async store ({ request, response, i18n }: HttpContextContract) {
    const data = await request.validate(UserValidator)

    const user = await User.create(data)
    const token = await Token.generateVerifyEmailToken(user)
    const activeEmailLink = Route.makeUrl('verify.email.verify', [token])

    await Mail.sendLater((message) => {
      message
        .from('noreply@leadcode.fr')
        .to(user.email)
        .subject(i18n.formatMessage('emails.active_account.subject'))
        .html(i18n.formatMessage('emails.active_account.html', { url: Env.get('DOMAIN') + activeEmailLink }))
    })

    return response.redirect().toRoute('verify.email')
  }
}
