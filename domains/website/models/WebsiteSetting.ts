import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import { responsiveAttachment, ResponsiveAttachmentContract } from "@ioc:Adonis/Addons/ResponsiveAttachment";

export enum WebsiteSettingKey {
  siteName = 'site_name',
  description = 'description',
  logo = 'logo',
  image = 'image',
  favicon = 'favicon',

  facebook = 'facebook',
  twitter = 'twitter',
  linkedin = 'linkedin',
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

  @responsiveAttachment({
    folder: 'website',
    forceFormat: 'webp',
    preComputeUrls: true
  })
  public picture: ResponsiveAttachmentContract | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
