import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {rules} from "@adonisjs/validator/build/src/Rules";
import I18n from "@ioc:Adonis/Addons/I18n";
import {PostMode} from "Domains/news/models/Post";

export default class PostValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    picture: schema.file.optional({
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg', 'webp']
    }),
    mode: schema.enum(Object.values(PostMode)),
    translations: schema.object().members(
      I18n.supportedLocales().reduce((accumulator, current) => ({
        ...accumulator,
        [current]: schema.object().members({
          id: schema.number.optional([rules.unsigned()]),
          title: schema.string({ trim: true }, [rules.required(), rules.minLength(2), rules.maxLength(255)]),
          content: schema.string.nullableAndOptional({ trim: true }, [rules.requiredWhen('mode', '=', PostMode.PUBLISH)]),
          locale: schema.string({ trim: true }),
        })
      }), {})
      )
  })

  public messages: CustomMessages = this.ctx.i18n.validatorMessages('models.posts.validator')
}
