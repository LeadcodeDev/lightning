import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import User from "Domains/users/models/User";
import Token from "Domains/users/models/Token";
import Route from "@ioc:Adonis/Core/Route";
import Env from "@ioc:Adonis/Core/Env";
import { randomUUID } from 'node:crypto'
import {UserStoreValidator, UserUpdateValidator} from "Apps/manager/validators/UserValidator";
import Role from "Domains/users/models/Role";
import SendNewAccountPassword from "Apps/manager/mails/SendNewAccountPassword";
import DefaultEmailSettings from "App/Mailers/DefaultEmailSettings";

export default class UsersController {
  public async index ({ view, request, bouncer }: HttpContextContract): Promise<string> {
    await bouncer
      .with('ManagerUserPolicy')
      .authorize('viewList')

    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const users = await User.query()
      .preload('roles')
      .paginate(page, limit)

    return view.render('manager::views/users/index', { users: users.toJSON() })
  }

  public async create ({ auth, view, bouncer }: HttpContextContract): Promise<string> {
    await bouncer
      .with('ManagerUserPolicy')
      .authorize('create')

    const highRole = await User.getHighRole(auth.user!)
    const roles: Role[] = await Role.query()
      .if(auth.user?.isAdmin, (query) => query)
      .if(!auth.user?.isAdmin, (query) => query.where('power', '<', highRole?.power || 0))

    return view.render('manager::views/users/create', { roles })
  }

  public async store ({ request, bouncer, response }: HttpContextContract): Promise<void> {
    await bouncer
      .with('ManagerUserPolicy')
      .authorize('create')

    const data = await request.validate(UserStoreValidator)

    const password: string = randomUUID()
    const user: User = await User.create({ ...data, password: password })
    const token: string = await Token.generateVerifyEmailToken(user)
    const activeEmailLink: string = Route.makeUrl('verify.email.verify', [token])

    const emailSettings = await new DefaultEmailSettings().get()
    await new SendNewAccountPassword(emailSettings, user, password, Env.get('DOMAIN') + activeEmailLink)
      .sendLater()

    return response.redirect().toRoute('manager.users.index')
  }

  public async edit ({ auth, view, params, bouncer }: HttpContextContract): Promise<string> {
    const user: User = await User.query()
      .where('id', params.id)
      .preload('roles')
      .firstOrFail()

    await bouncer
      .with('ManagerUserPolicy')
      .authorize('update', user)

    const highRole = await User.getHighRole(auth.user!)
    const roles: Role[] = await Role.query()
      .if(auth.user?.isAdmin, (query) => query)
      .if(!auth.user?.isAdmin, (query) => query.where('power', '<', highRole?.power || 0))
      .orderBy('power', 'asc')

    return view.render('manager::views/users/edit', { user, roles })
  }

  public async update ({ request, response, bouncer, params }: HttpContextContract) {
    const user: User = await User.query()
      .where('id', params.id)
      .firstOrFail()

    await bouncer
      .with('ManagerUserPolicy')
      .authorize('update', user)

    const data = await request.validate(UserUpdateValidator)

    await user.merge(data).save()
    await User.syncRoles(user, request)

    return response.redirect().toRoute('manager.users.index')
  }
}
