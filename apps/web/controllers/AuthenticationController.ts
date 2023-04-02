import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from "Domains/users/models/User";
import {schema} from "@ioc:Adonis/Core/Validator";
import {rules} from "@adonisjs/validator/build/src/Rules";
import Hash from "@ioc:Adonis/Core/Hash";

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

    const user = await User.query()
      .where('email', email)
      .firstOrFail()

    if (!user.hasEmailVerified) {
      session.flash('error', 'Your account is not active')
      return response.redirect().back()
    }

    if (!(await Hash.verify(user.password, password))) {
      session.flash('error', 'Bad credentials')
      return response.redirect().back()
    }

    await auth.use('web').login(user)

    return response.redirect().back()
  }
}
