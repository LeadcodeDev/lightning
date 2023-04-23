import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {rules} from "@adonisjs/validator/build/src/Rules";

export default class RoleValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    label: schema.string({ trim: true }, [
      rules.minLength(2),
      rules.maxLength(255)
    ]),
    power: schema.number([
      rules.unsigned(),
      rules.range(0, 100),
    ]),
  })

  public messages: CustomMessages = this.ctx.i18n.validatorMessages('models.roles.validator')
}
