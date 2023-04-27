import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {rules} from "@adonisjs/validator/build/src/Rules";

export default class PostTagValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    label: schema.string({ trim: true }, [
      rules.required(),
      rules.minLength(2),
      rules.maxLength(255)
    ]),
  })

  public messages: CustomMessages = this.ctx.i18n.validatorMessages('models.posts.validator')
}
