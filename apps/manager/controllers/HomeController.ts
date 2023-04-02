import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class HomeController {
  public async home ({ view }: HttpContextContract): Promise<string>{
    return view.render('manager::views/home')
  }
}
