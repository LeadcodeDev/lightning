import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import Role from "Domains/users/models/Role";
import RoleValidator from "Apps/manager/validators/RoleValidator";
import Permission from "Domains/users/models/Permission";

export default class RolesController {
  public async index ({ view, request, bouncer }: HttpContextContract): Promise<string> {
    await bouncer
      .with('ManagerRolePolicy')
      .authorize('viewList')

    const page = request.input('page', 1)
    const limit = request.input('limit', 2)

    const search = request.input('search')
    const roles = await Role.query()
      .if(search, (query) => query
        .orWhere('label', 'like', `%${search}%`)
        .orWhere('power', 'like', `%${search}%`)
      )
      .paginate(page, limit)

    return view.render('manager::views/roles/index', { roles: roles.toJSON() })
  }

  public async create ({ view, bouncer }: HttpContextContract): Promise<string> {
    await bouncer
      .with('ManagerRolePolicy')
      .authorize('create')

    const permissions = await Permission.query()
      .orderBy('key', 'asc')

    return view.render('manager::views/roles/create', { permissions })
  }

  public async store ({ request, response, bouncer, session, i18n }: HttpContextContract): Promise<void> {
    await bouncer
      .with('ManagerRolePolicy')
      .authorize('create')

    const data = await request.validate(RoleValidator)

    const role: Role = await Role.create(data)
    await Role.syncPermissions(role, request)

    session.flash('notification', {
      type: 'success',
      message: i18n.formatMessage('models.news.notifications.create')
    })

    return response.redirect().toRoute('manager.roles.index')
  }

  public async edit ({ view, params, bouncer }: HttpContextContract): Promise<string> {
    const role: Role = await Role.query()
      .where('id', params.id)
      .preload('permissions')
      .firstOrFail()

    await bouncer
      .with('ManagerRolePolicy')
      .authorize('update', role)

    const permissions = await Permission.query()
      .orderBy('key', 'asc')

    return view.render('manager::views/roles/edit', { role, permissions })
  }

  public async update ({ request, response, params, bouncer, session, i18n }: HttpContextContract) {
    const role: Role = await Role.query()
      .where('id', params.id)
      .firstOrFail()

    await bouncer
      .with('ManagerRolePolicy')
      .authorize('update', role)

    const data = await request.validate(RoleValidator)

    await role.merge(data).save()
    await Role.syncPermissions(role, request)

    session.flash('notification', {
      type: 'success',
      message: i18n.formatMessage('models.roles.notifications.update')
    })

    return response.redirect().toRoute('manager.roles.index')
  }

  public async destroy ({ response, params, bouncer, session, i18n }: HttpContextContract): Promise<void> {
    const role: Role = await Role.findOrFail(params.id)

    await bouncer
      .with('ManagerRolePolicy')
      .authorize('delete', role)

    await role.delete()

    session.flash('notification', {
      type: 'success',
      message: i18n.formatMessage('models.news.notifications.delete')
    })

    response.redirect().back()
  }
}
