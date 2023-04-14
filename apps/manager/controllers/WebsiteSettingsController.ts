import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import WebsiteSetting from 'Domains/website/models/WebsiteSetting'
import {rules} from '@adonisjs/validator/build/src/Rules'
import Redis from '@ioc:Adonis/Addons/Redis'
import {Attachment} from "@adonisjs/attachment-lite/build/src/Attachment";

export default class WebsiteSettingsController {
  public async index ({ view }: HttpContextContract): Promise<string> {
    const settings: WebsiteSetting[] = await WebsiteSetting.all()
    return view.render('manager::views/settings/index', { settings })
  }

  public async edit ({ view, params }: HttpContextContract): Promise<string> {
    const setting: WebsiteSetting = await WebsiteSetting.findOrFail(params.id)

    return view.render('manager::views/settings/edit', { setting })
  }

  public async update ({ request, response, params }: HttpContextContract) {
    const data = await request.validate({
      schema: schema.create({
        value: schema.string.nullableAndOptional({ trim: true }, [
          rules.maxLength(255)
        ]),
        picture: schema.file.nullableAndOptional({
          extnames: ['jpeg', 'jpg', 'png', 'webp'],
          size: '2mb'
        })
      })
    })

    const setting: WebsiteSetting = await WebsiteSetting.query()
      .where('id', params.id)
      .firstOrFail()

    if (data.picture) {
      if (!data.picture.isValid) {
        return data.picture.errors
      }

      setting.picture = Attachment.fromFile(data.picture)
      await setting.save()
    } else {
      await setting.merge({ value: data.value }).save()
    }

    await Redis.del(WebsiteSetting.key)

    return response.redirect().toRoute('manager.settings.index')
  }

  public async clearCache ({ response }: HttpContextContract): Promise<void> {
    await Redis.del(WebsiteSetting.key)
    return response.redirect().back()
  }
}
