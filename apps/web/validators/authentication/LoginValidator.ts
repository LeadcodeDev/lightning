import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, CustomMessages } from "@ioc:Adonis/Core/Validator";
import {rules} from "@adonisjs/validator/build/src/Rules";

export default class LoginValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({ trim: true }, [rules.exists({ table: 'users', column: 'email' })]),
    password: schema.string({ trim: true })
  })

  public messages: CustomMessages = {
    required: 'Le champ {{ field }} est requis',
  }
}
