import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import Permission from "Domains/users/models/Permission";

export default class PermissionsController {
  public async index ({ view }: HttpContextContract): Promise<string> {
    const permissions: Permission[] = await Permission.all()
    return view.render('manager::views/permissions/index', { permissions })
  }

  public async show ({ view, params }: HttpContextContract): Promise<string> {
    const permission: Permission = await Permission.query()
      .where('id', params.id)
      .firstOrFail()

    return view.render('manager::views/permissions/show', { permission })
  }
}
