import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { randomUUID } from 'node:crypto'
import {PermissionKey} from "Domains/users/models/Permission";

export default class extends BaseSchema {
  protected tableName = 'permissions'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table.string('key').notNullable()
      table.string('label').notNullable()
      table.string('description')
    })

    this.defer(async (database) => {
      await database.table(this.tableName).multiInsert([
        { id: randomUUID(), key: PermissionKey.manageAccess, label: 'permissions.access_manager.label', description: 'permissions.access_manager.description' },

        { id: randomUUID(), key: PermissionKey.userView, label: 'permissions.users.view.label', description: 'permissions.users.view.description' },
        { id: randomUUID(), key: PermissionKey.userCreate, label: 'permissions.users.create.label', description: 'permissions.users.create.description' },
        { id: randomUUID(), key: PermissionKey.userEdit, label: 'permissions.users.edit.label', description: 'permissions.users.edit.description' },
        { id: randomUUID(), key: PermissionKey.userDelete, label: 'permissions.users.delete.label', description: 'permissions.users.delete.description' },
        { id: randomUUID(), key: PermissionKey.userManageRole, label: 'permissions.users.manage_roles.label', description: 'permissions.users.manage_roles.description' },

        { id: randomUUID(), key: PermissionKey.roleView, label: 'permissions.roles.view.label', description: 'permissions.roles.view.description' },
        { id: randomUUID(), key: PermissionKey.roleCreate, label: 'permissions.roles.create.label', description: 'permissions.roles.create.description' },
        { id: randomUUID(), key: PermissionKey.roleEdit, label: 'permissions.roles.edit.label', description: 'permissions.roles.edit.description' },
        { id: randomUUID(), key: PermissionKey.roleDelete, label: 'permissions.roles.delete.label', description: 'permissions.roles.delete.description' },

        { id: randomUUID(), key: PermissionKey.newsArticleView, label: 'permissions.news.articles.view.label', description: 'permissions.news.articles.view.description' },
        { id: randomUUID(), key: PermissionKey.newsArticleCreate, label: 'permissions.news.articles.create.label', description: 'permissions.news.articles.create.description' },
        { id: randomUUID(), key: PermissionKey.newsArticleEdit, label: 'permissions.news.articles.edit.label', description: 'permissions.news.articles.edit.description' },
        { id: randomUUID(), key: PermissionKey.newsArticleDelete, label: 'permissions.news.articles.delete.label', description: 'permissions.news.articles.delete.description' },

        { id: randomUUID(), key: PermissionKey.settingGlobalView, label: 'permissions.settings.global.view.label', description: 'permissions.settings.global.view.description' },
        { id: randomUUID(), key: PermissionKey.settingGlobalEdit, label: 'permissions.settings.global.edit.label', description: 'permissions.settings.global.edit.description' },

        { id: randomUUID(), key: PermissionKey.permissionView, label: 'permissions.permissions.view.label', description: 'permissions.permissions.view.description' },
      ])
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
