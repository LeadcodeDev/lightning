import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { attachment, AttachmentContract } from '@ioc:Adonis/Addons/AttachmentLite'

export enum WebsiteSettingKey {
  title = 'title',
  description = 'description',
  logo = 'logo',
  image = 'image',
  favicon = 'favicon'
}

export default class WebsiteSetting extends BaseModel {
  public static key: string = 'website-settings'

  @column({ isPrimary: true })
  public id: number

  @column()
  public label: string

  @column()
  public description: string | null

  @column()
  public key: WebsiteSettingKey

  @column()
  public value: string | null

  @column()
  public mode: 'text' | 'image'

  @attachment({ preComputeUrl: true })
  public picture: AttachmentContract | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
