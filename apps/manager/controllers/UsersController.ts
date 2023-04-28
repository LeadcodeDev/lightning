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
  public async index ({ view, request, bouncer }: HttpContextContract): Promise<string> {
    await bouncer
      .with('ManagerUserPolicy')
      .authorize('viewList')

    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const users = await User.query()
      .paginate(page, limit)

    return view.render('manager::views/users/index', { users: users.toJSON() })
  }

  public async create ({ auth, view, bouncer }: HttpContextContract): Promise<string> {
    await bouncer
      .with('ManagerUserPolicy')
      .authorize('create')

    const highRole = await User.highRole(auth.user!)
    const roles: Role[] = await Role.query()
      .if(auth.user?.isAdmin, (query) => query)
      .if(!auth.user?.isAdmin, (query) => query.where('power', '<', highRole.power))

    return view.render('manager::views/users/create', { roles })
  }

  public async store ({ request, bouncer, i18n, response }: HttpContextContract): Promise<void> {
    await bouncer
      .with('ManagerUserPolicy')
      .authorize('create')

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

  public async edit ({ auth, view, params, bouncer }: HttpContextContract): Promise<string> {
    const highRole = await User.highRole(auth.user!)
    const roles: Role[] = await Role.query()
      .if(auth.user?.isAdmin, (query) => query)
      .if(!auth.user?.isAdmin, (query) => query.where('power', '<', highRole.power))

    const user: User = await User.query()
      .where('id', params.id)
      .preload('roles')
      .firstOrFail()

    await bouncer
      .with('ManagerUserPolicy')
      .authorize('update', user)

    return view.render('manager::views/users/edit', { user, roles })
  }

  public async update ({ request, response, bouncer, params }: HttpContextContract) {
    const data = await request.validate(UserUpdateValidator)
    const user: User = await User.query()
      .where('id', params.id)
      .firstOrFail()

    await bouncer
      .with('ManagerUserPolicy')
      .authorize('update', user)

    await user.merge(data).save()
    await User.syncRoles(user, request)

    return response.redirect().toRoute('manager.users.index')
  }
}
