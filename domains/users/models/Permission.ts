import { DateTime } from 'luxon'
import { column, BaseModel } from '@ioc:Adonis/Lucid/Orm'
import { beforeCreate } from "@adonisjs/lucid/build/src/Orm/Decorators";
import { randomUUID } from 'node:crypto'

export type PermissionMode = 'VIEW' | 'STORE' | 'UPDATE' | 'DELETE'
export default class Permission extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public label: string

  @column()
  public description: string | null

  @column()
  public section: string

  @column()
  public mode: PermissionMode

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async generateUid (role: Permission): Promise<void> {
    role.id = randomUUID()
  }
}
