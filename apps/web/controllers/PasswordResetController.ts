import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Mail from '@ioc:Adonis/Addons/Mail'
import Route from '@ioc:Adonis/Core/Route'
import Env from '@ioc:Adonis/Core/Env'
import { schema } from '@ioc:Adonis/Core/Validator'
import {rules} from "@adonisjs/validator/build/src/Rules";
import User from "Domains/users/models/User";
import Token from "Domains/users/models/Token";

export default class PasswordResetController {
  public async forgot ({ view }: HttpContextContract): Promise<string> {
    return view.render('web::views/password/forgot')
  }

  public async send ({ request, response, session }: HttpContextContract): Promise<void> {
    const { email } = await request.validate({
      schema: schema.create({
        email: schema.string([rules.email()])
      })
    })

    const user = await User.findBy('email', email)
    const token = await Token.generatePasswordResetToken(user)
    const resetLink = Route.makeUrl('password.reset', [token])

    if (user) {
      await Mail.sendLater((message) => {
        message
          .from('noreply@leadcode.fr')
          .to(user.email)
          .subject('Reset your password')
          .html(`Reset your password <a href="${Env.get('DOMAIN')}${resetLink}">here</a>`)
        }
      )
    }

    session.flash('success', 'If an account matches the provided email, you will receive a password reset link shortly')
    return response.redirect().back()
  }

  public async reset ({ view, params }: HttpContextContract): Promise<String> {
    const isValid = await Token.verify(params.token)

    return view.render('web::views/password/reset', { isValid, token: params.token })
  }

  public async store ({ request, response, session, auth }: HttpContextContract): Promise<void> {
    const { token, password } = await request.validate({
      schema: schema.create({
        token: schema.string({ trim: true }),
        password: schema.string({ trim: true }, [rules.minLength(8)])
      })
    })

    const user = await Token.getPasswordResetUser(token)

    if (!user) {
      session.flash('error', 'Token expired or associated user could not be found')
      return response.redirect().back()
    }

    await user.merge({ password }).save()
    await auth.login(user)

    return response.redirect().toPath('/')
  }
}
