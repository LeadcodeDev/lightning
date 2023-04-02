import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {schema} from "@ioc:Adonis/Core/Validator";
import {rules} from "@adonisjs/validator/build/src/Rules";

export default class AuthenticationController {
  public async showLogin ({ view }: HttpContextContract): Promise<string>{
    return view.render('web::views/authentication/login')
  }

  public async login ({ request, response, auth, session }: HttpContextContract) {
    const { email, password } = await request.validate({
      schema: schema.create({
        email: schema.string({ trim: true }, [rules.exists({ table: 'users', column: 'email' })]),
        password: schema.string({ trim: true })
      })
    })

    try {
      await auth.use('web').attempt(email, password)
      response.redirect('/')
    } catch {
      session.flash('error', 'Bad credentials')
      return response.redirect().back()
    }
  }

  public async logout ({ response, auth }: HttpContextContract) {
    await auth.logout()
    return response.redirect().back()
  }
}
