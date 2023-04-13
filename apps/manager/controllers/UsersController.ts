import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import User from "Domains/users/models/User";
import {schema} from "@ioc:Adonis/Core/Validator";
import {rules} from "@adonisjs/validator/build/src/Rules";
import Token from "Domains/users/models/Token";
import Route from "@ioc:Adonis/Core/Route";
import Mail from "@ioc:Adonis/Addons/Mail";
import Env from "@ioc:Adonis/Core/Env";
import { randomUUID } from 'node:crypto'

export default class UsersController {
  public async index ({ view }: HttpContextContract): Promise<string> {
    const users: User[] = await User.all()
    return view.render('manager::views/users/index', { users })
  }

  public async edit ({ view, params }: HttpContextContract): Promise<string> {
    const user: User = await User.query()
      .where('id', params.id)
      .firstOrFail()

    return view.render('manager::views/users/edit', { user })
  }

  public async create ({ view }: HttpContextContract): Promise<string> {
    return view.render('manager::views/users/create')
  }

  public async store ({ request, i18n, response }: HttpContextContract): Promise<void> {
    const data = await request.validate({
      schema: schema.create({
        username: schema.string({ trim: true }, [
          rules.minLength(2),
          rules.maxLength(255)
        ]),
        email: schema.string({ trim: true }, [
          rules.email(),
          rules.notExists({ column: 'email', table: 'users' })
        ])
      }),
      messages: {
        'email.notExists': 'L\'email existe déjà au sein de nos services.'
      }
    })

    const password: string = randomUUID()
    const user: User = await User.create({ ...data, password: password })
    const token: string = await Token.generateVerifyEmailToken(user)
    const activeEmailLink = Route.makeUrl('verify.email.verify', [token])

    await Mail.sendLater((message) => {
      message
        .from('noreply@leadcode.fr')
        .to(user.email)
        .subject(i18n.formatMessage('emails.new_account_give_password.subject'))
        .html(i18n.formatMessage('emails.new_account_give_password.html', { email: data.email, password }))
    })

    await Mail.sendLater((message) => {
      message
        .from('noreply@leadcode.fr')
        .to(user.email)
        .subject(i18n.formatMessage('emails.active_account.subject'))
        .html(i18n.formatMessage('emails.active_account.html', { url: Env.get('DOMAIN') + activeEmailLink }))
    })

    return response.redirect().toRoute('manager.users.index')
  }
}
