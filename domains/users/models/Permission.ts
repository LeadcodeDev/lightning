import { column, BaseModel } from '@ioc:Adonis/Lucid/Orm'
import { beforeCreate } from "@adonisjs/lucid/build/src/Orm/Decorators";
import { randomUUID } from 'node:crypto'

export enum PermissionKey {
  manageAccess = 'manager.access',

  userView = 'users.view',
  userEdit = 'users.edit',
  userDelete = 'users.delete',
  userManageRole = 'users.roles.manage',

  roleView = 'roles.view',
  roleEdit = 'roles.edit',
  roleDelete = 'roles.delete',
}
export default class Permission extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public key: PermissionKey

  @column()
  public label: string

  @column()
  public description: string | null

  @beforeCreate()
  public static async generateUid (role: Permission): Promise<void> {
    role.id = randomUUID()
  }
}
