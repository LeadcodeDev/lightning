import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import Permission from "Domains/users/models/Permission";

export default class PermissionsController {
  public async index ({ view, request, bouncer }: HttpContextContract): Promise<string> {
    await bouncer
      .with('ManagerPermissionPolicy')
      .authorize('viewList')

    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const search = request.input('search')
    const permissions= await Permission.query()
      .if(search, (query) => query
        .orWhere('label', 'like', `%${search}%`)
      )
      .paginate(page, limit)

    return view.render('manager::views/permissions/index', { permissions: permissions.toJSON() })
  }

  public async show ({ view, params, bouncer }: HttpContextContract): Promise<string> {
    const permission: Permission = await Permission.query()
      .where('id', params.id)
      .firstOrFail()

    await bouncer
      .with('ManagerPermissionPolicy')
      .authorize('view', permission)

    return view.render('manager::views/permissions/show', { permission })
  }
}
