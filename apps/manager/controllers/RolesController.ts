import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import Role from "Domains/users/models/Role";
import RoleValidator from "Apps/manager/validators/RoleValidator";
import Permission from "Domains/users/models/Permission";

export default class RolesController {
  public async index ({ view, request }: HttpContextContract): Promise<string> {
    const page = request.input('page', 1)
    const limit = request.input('limit', 2)

    const roles = await Role.query()
      .paginate(page, limit)

    return view.render('manager::views/roles/index', { roles: roles.toJSON() })
  }

  public async create ({ view }: HttpContextContract): Promise<string> {
    const permissions = await Permission.all()

    return view.render('manager::views/roles/create', { permissions })
  }

  public async store ({ request, response }: HttpContextContract): Promise<void> {
    const data = await request.validate(RoleValidator)

    const role: Role = await Role.create(data)
    await Role.syncPermissions(role, request)

    return response.redirect().toRoute('manager.roles.index')
  }

  public async edit ({ view, params }: HttpContextContract): Promise<string> {
    const permissions = await Permission.all()
    const role: Role = await Role.query()
      .where('id', params.id)
      .preload('permissions')
      .firstOrFail()

    return view.render('manager::views/roles/edit', { role, permissions })
  }

  public async update ({ request, response, params }: HttpContextContract) {
    const data = await request.validate(RoleValidator)
    const role: Role = await Role.query()
      .where('id', params.id)
      .firstOrFail()

    await role.merge(data).save()
    await Role.syncPermissions(role, request)

    return response.redirect().toRoute('manager.roles.index')
  }

  public async destroy ({ response, params }: HttpContextContract): Promise<void> {
    const role: Role = await Role.findOrFail(params.id)
    await role.delete()

    response.redirect().back()
  }
}
