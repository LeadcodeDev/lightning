import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from "Domains/users/models/User";
import {schema} from "@ioc:Adonis/Core/Validator";
import {rules} from "@adonisjs/validator/build/src/Rules";
import Token from "Domains/users/models/Token";
import Mail from "@ioc:Adonis/Addons/Mail";
import Route from "@ioc:Adonis/Core/Route";
import Env from "@ioc:Adonis/Core/Env";

export default class UserController {
  public async create ({ view }: HttpContextContract): Promise<string>{
    return view.render('web::views/authentication/create_user')
  }

  public async confirmEmail ({ params, response, session }: HttpContextContract) {
    const token = await Token.query()
      .where('token', params.token)
      .first()

    if (token) {
      await token.related('user').query().update({
        hasEmailVerified: true
      })

      await token.delete()
      session.flash('success', 'Your email was verified')
    }

    response.redirect().toRoute('authentication.login')
  }

  public async store ({ request, response }: HttpContextContract) {
    const data = await request.validate({
      schema: schema.create({
        username: schema.string({ trim: true }),
        email: schema.string({ trim: true }, [rules.email()]),
        password: schema.string({ trim: true }, [rules.confirmed()]),
      })
    })

    const user = await User.create(data)
    const token = await Token.generatePasswordResetToken(user)
    const activeEmailLink = Route.makeUrl('user.confirmEmail', [token])

    await Mail.sendLater((message) => {
      message
        .from('noreply@leadcode.fr')
        .to(user.email)
        .subject('Active your account')
        .html(`Click here to activate your account <a href="${Env.get('DOMAIN')}${activeEmailLink}">click !</a>`)
    })

    return response.redirect().toRoute('authentication.showLoginForm')
  }
}
