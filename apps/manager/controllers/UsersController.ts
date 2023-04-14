import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import User from "Domains/users/models/User";
import Token from "Domains/users/models/Token";
import Route from "@ioc:Adonis/Core/Route";
import Mail from "@ioc:Adonis/Addons/Mail";
import Env from "@ioc:Adonis/Core/Env";
import { randomUUID } from 'node:crypto'
import {UserStoreValidator, UserUpdateValidator} from "Apps/manager/validators/UserValidator";
import Role from "Domains/users/models/Role";

export default class UsersController {
  public async index ({ view }: HttpContextContract): Promise<string> {
    const users: User[] = await User.all()
    return view.render('manager::views/users/index', { users })
  }

  public async edit ({ view, params }: HttpContextContract): Promise<string> {
    const roles: Role[] = await Role.all()
    const user: User = await User.query()
      .where('id', params.id)
      .preload('roles')
      .firstOrFail()

    return view.render('manager::views/users/edit', { user, roles })
  }

  public async create ({ view }: HttpContextContract): Promise<string> {
    return view.render('manager::views/users/create')
  }

  public async store ({ request, i18n, response }: HttpContextContract): Promise<void> {
    const data = await request.validate(UserStoreValidator)

    const password: string = randomUUID()
    const user: User = await User.create({ ...data, password: password })
    const token: string = await Token.generateVerifyEmailToken(user)
    const activeEmailLink: string = Route.makeUrl('verify.email.verify', [token])

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

  public async update ({ request, response, params }: HttpContextContract) {
    const data = await request.validate(UserUpdateValidator)
    const user: User = await User.query()
      .where('id', params.id)
      .firstOrFail()

    await user.merge(data).save()
    await User.syncRoles(user, request)

    return response.redirect().toRoute('manager.users.index')
  }
}
