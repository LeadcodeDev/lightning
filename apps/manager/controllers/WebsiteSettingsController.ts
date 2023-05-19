import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import WebsiteSetting from 'Domains/website/models/WebsiteSetting'
import { rules } from '@adonisjs/validator/build/src/Rules'
import Redis from '@ioc:Adonis/Addons/Redis'
import { ResponsiveAttachment } from "adonis-responsive-attachment/build/src/Attachment";

export default class WebsiteSettingsController {
  public async index ({ view, request }: HttpContextContract): Promise<string> {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const settings = await WebsiteSetting.query()
      .paginate(page, limit)

    return view.render('manager::views/settings/index', { settings: settings.toJSON() })
  }

  public async edit ({ view, params }: HttpContextContract): Promise<string> {
    const setting: WebsiteSetting = await WebsiteSetting.findOrFail(params.id)

    return view.render('manager::views/settings/edit', { setting })
  }

  public async update ({ request, response, params, session, i18n }: HttpContextContract) {
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

      setting.picture = await ResponsiveAttachment.fromFile(data.picture)
      await setting.save()
    } else {
      await setting.merge({ value: data.value }).save()
    }

    await Redis.del(WebsiteSetting.key)

    session.flash('notification', {
      type: 'success',
      message: i18n.formatMessage('models.website.settings.notifications.update')
    })

    return response.redirect().toRoute('manager.settings.index')
  }

  public async clearCache ({ response, session, i18n }: HttpContextContract): Promise<void> {
    await Redis.del(WebsiteSetting.key)

    session.flash('notification', {
      type: 'info',
      message: i18n.formatMessage('models.website.settings.notifications.invalidate')
    })

    return response.redirect().back()
  }
}
