import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {rules} from "@adonisjs/validator/build/src/Rules";

export class UserStoreValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    username: schema.string({ trim: true }, [
      rules.minLength(2),
      rules.maxLength(255)
    ]),
    email: schema.string({ trim: true }, [
      rules.minLength(2),
      rules.maxLength(255),
      rules.email(),
      rules.unique({ column: 'email', table: 'users' }),
      rules.normalizeEmail({
        allLowercase: true,
        gmailRemoveDots: false,
      }),
    ])
  })

  public messages: CustomMessages = this.ctx.i18n.validatorMessages('validators.users')
}

export class UserUpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    firstname: schema.string({ trim: true }, [
      rules.minLength(2),
      rules.maxLength(255)
    ]),
    lastname: schema.string({ trim: true }, [
      rules.minLength(2),
      rules.maxLength(255)
    ]),
    email: schema.string({ trim: true }, [
      rules.minLength(2),
      rules.maxLength(255),
      rules.email(),
      rules.normalizeEmail({
        allLowercase: true,
        gmailRemoveDots: false,
      }),
    ]),
    isLocked: schema.boolean.optional(),
    isAdmin: schema.boolean.optional(),
    avatar: schema.file.nullableAndOptional({
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg', 'webp'],
    })
  })

  public messages: CustomMessages = this.ctx.i18n.validatorMessages('validators.users')
}
