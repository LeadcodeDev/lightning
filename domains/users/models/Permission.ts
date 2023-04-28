import { column, BaseModel } from '@ioc:Adonis/Lucid/Orm'
import { beforeCreate } from "@adonisjs/lucid/build/src/Orm/Decorators";
import { randomUUID } from 'node:crypto'

export enum PermissionKey {
  manageAccess = 'manager.access',

  userView = 'users.view',
  userCreate = 'users.create',
  userEdit = 'users.edit',
  userDelete = 'users.delete',
  userManageRole = 'users.roles.manage',

  roleView = 'roles.view',
  roleCreate = 'roles.create',
  roleEdit = 'roles.edit',
  roleDelete = 'roles.delete',

  settingGlobalView = 'settings.global.view',
  settingGlobalEdit = 'settings.global.edit',
  settingGlobalDelete = 'settings.global.delete',

  permissionView = 'permissions.view',

  newsArticleView = 'news.articles.view',
  newsArticleCreate = 'news.articles.create',
  newsArticleEdit = 'news.articles.edit',
  newsArticleDelete = 'news.articles.delete',
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
