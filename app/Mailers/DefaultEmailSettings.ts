import WebsiteSetting from "Domains/website/models/WebsiteSetting";

export default class DefaultEmailSettings {
  public async get () {
    const settings = await WebsiteSetting.all()

    return settings.reduce((acc, current) => {
      if (current.mode === 'image') {
        return { ...acc, [current.key]: current.picture?.url }
      }

      return { ...acc, [current.key]: current.value || '' }
    })
  }
}
