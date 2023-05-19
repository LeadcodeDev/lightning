import {CustomMessages, schema} from "@ioc:Adonis/Core/Validator";
import {rules} from "@adonisjs/validator/build/src/Rules";
import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";

export default class UserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    firstname: schema.string({ trim: true }),
    lastname: schema.string({ trim: true }),
    email: schema.string({ trim: true }, [rules.email()]),
    password: schema.string({ trim: true }, [rules.confirmed()]),
  })

  public messages: CustomMessages = this.ctx.i18n.validatorMessages('validator.user')
}
