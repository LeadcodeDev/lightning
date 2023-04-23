import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import Permission from "Domains/users/models/Permission";

export default class PermissionsController {
  public async index ({ view, request }: HttpContextContract): Promise<string> {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const permissions= await Permission.query()
      .paginate(page, limit)

    return view.render('manager::views/permissions/index', { permissions: permissions.toJSON() })
  }

  public async show ({ view, params }: HttpContextContract): Promise<string> {
    const permission: Permission = await Permission.query()
      .where('id', params.id)
      .firstOrFail()

    return view.render('manager::views/permissions/show', { permission })
  }
}
