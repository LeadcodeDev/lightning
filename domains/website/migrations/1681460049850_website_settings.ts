import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import {WebsiteSettingKey} from "Domains/website/models/WebsiteSetting";

export default class extends BaseSchema {
  protected tableName = 'website_settings'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('label').notNullable()
      table.string('description')
      table.string('key').notNullable()
      table.string('value')
      table.json('picture')
      table.string('mode').notNullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })

    this.defer(async (database) => {
      await database.table(this.tableName).multiInsert([
        { key: WebsiteSettingKey.siteName, label: 'models.website.settings.title.label', description: 'models.website.settings.title.description', value: 'Lightning', mode: 'text' },
        { key: WebsiteSettingKey.description, label: 'models.website.settings.description.label', description: 'models.website.settings.description.description', mode: 'text' },
        { key: WebsiteSettingKey.logo, label: 'models.website.settings.logo.label', description: 'models.website.settings.logo.description', mode: 'image' },
        { key: WebsiteSettingKey.image, label: 'models.website.settings.image.label', description: 'models.website.settings.image.description', mode: 'image' },
        { key: WebsiteSettingKey.favicon, label: 'models.website.settings.favicon.label', description: 'models.website.settings.favicon.description', mode: 'image' },

        { key: WebsiteSettingKey.facebook, label: 'models.website.settings.facebook.label', description: 'models.website.settings.facebook.description', mode: 'text' },
        { key: WebsiteSettingKey.twitter, label: 'models.website.settings.twitter.label', description: 'models.website.settings.twitter.description', mode: 'text' },
        { key: WebsiteSettingKey.linkedin, label: 'models.website.settings.linkedin.label', description: 'models.website.settings.linkedin.description', mode: 'text' },
      ])
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
