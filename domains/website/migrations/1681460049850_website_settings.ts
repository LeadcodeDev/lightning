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
        { key: WebsiteSettingKey.title, label: 'settings.title.label', description: 'settings.title.description', value: 'Lightning', mode: 'text' },
        { key: WebsiteSettingKey.description, label: 'settings.description.label', description: 'settings.description.description', mode: 'text' },
        { key: WebsiteSettingKey.logo, label: 'settings.logo.label', description: 'settings.logo.description', mode: 'image' },
        { key: WebsiteSettingKey.image, label: 'settings.image.label', description: 'settings.image.description', mode: 'image' },
        { key: WebsiteSettingKey.favicon, label: 'settings.favicon.label', description: 'settings.favicon.description', mode: 'image' },
      ])
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
