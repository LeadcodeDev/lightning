import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Route from '@ioc:Adonis/Core/Route'
import Env from '@ioc:Adonis/Core/Env'
import { schema } from '@ioc:Adonis/Core/Validator'
import {rules} from "@adonisjs/validator/build/src/Rules";
import User from "Domains/users/models/User";
import Token from "Domains/users/models/Token";
import ResetPassword from "Apps/web/mails/ResetPassword";
import DefaultEmailSettings from "App/Mailers/DefaultEmailSettings";

export default class PasswordResetController {
  public async forgot ({ view }: HttpContextContract): Promise<string> {
    return view.render('web::views/password/forgot')
  }

  public async send ({ request, response, session, i18n }: HttpContextContract): Promise<void> {
    const { email } = await request.validate({
      schema: schema.create({
        email: schema.string([rules.email()])
      })
    })

    const user = await User.findBy('email', email)
    const token = await Token.generatePasswordResetToken(user)
    const resetLink = Route.makeUrl('password.reset', [token])

    if (user) {
      const emailSettings = await new DefaultEmailSettings().get()
      const email = new ResetPassword(
        emailSettings,
        user,
        Env.get('DOMAIN') + resetLink,
        i18n.formatMessage('emails.reset_password.subject')
      )

      await email.sendLater()
    }

    session.flash(
      i18n.formatMessage('password.success.keyword'),
      i18n.formatMessage('password.success.receive_password_reset_link')
    )

    return response.redirect().back()
  }

  public async reset ({ view, params }: HttpContextContract): Promise<String> {
    const isValid = await Token.verify(params.token)

    return view.render('web::views/password/reset', { isValid, token: params.token })
  }

  public async store ({ request, response, session, auth, i18n }: HttpContextContract): Promise<void> {
    const { token, password } = await request.validate({
      schema: schema.create({
        token: schema.string({ trim: true }),
        password: schema.string({ trim: true }, [rules.minLength(8)])
      })
    })

    const user = await Token.getPasswordResetUser(token)

    if (!user) {
      session.flash(
        i18n.formatMessage('password.error.keyword'),
        i18n.formatMessage('password.error.token_could_not_be_found')
      )

      return response.redirect().back()
    }

    await user.merge({ password }).save()
    await auth.login(user)

    return response.redirect().toPath('/')
  }
}
