import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import WebsiteSetting from "Domains/website/models/WebsiteSetting";
import Redis from '@ioc:Adonis/Addons/Redis'

export default class Website {
  public async handle({ view }: HttpContextContract, next: () => Promise<void>) {
    const websiteSettings: number = await Redis.exists(WebsiteSetting.key)

    if (!Boolean(websiteSettings)) {
      const settings = await WebsiteSetting.all()
      const payload = settings.reduce((acc, current) => {
        if (current.mode === 'image') {
          return { ...acc, [current.key]: current.picture?.url }
        }

        return { ...acc, [current.key]: current.value || '' }
      }, {})

      await Redis.set(WebsiteSetting.key, JSON.stringify(payload))
    }

    const data = await Redis.get(WebsiteSetting.key)
    view.share({
      'websiteSettings': JSON.parse(data!)
    })

    await next()
  }
}
