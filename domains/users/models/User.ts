import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import { beforeCreate } from "@adonisjs/lucid/build/src/Orm/Decorators";
import { randomUUID } from 'node:crypto'
import Token from "Domains/users/models/Token";

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public email: string

  @column()
  public username: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken: string | null

  @column()
  public hasEmailVerified: boolean = false

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Token)
  public tokens: HasMany<typeof Token>

  @hasMany(() => Token, {
    onQuery: query => query.where('type', 'PASSWORD_RESET')
  })
  public passwordResetTokens: HasMany<typeof Token>

  @beforeCreate()
  public static async generateUid (user: User): Promise<void> {
    user.id = randomUUID()
  }

  @beforeSave()
  public static async hashPassword (user: User): Promise<void> {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
