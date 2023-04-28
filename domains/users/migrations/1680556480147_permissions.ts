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
        { id: randomUUID(), key: PermissionKey.manageAccess, label: 'models.manager.policies.access.label', description: 'models.manager.policies.access.description' },

        { id: randomUUID(), key: PermissionKey.userView, label: 'models.users.policies.view.label', description: 'models.users.policies.view.description' },
        { id: randomUUID(), key: PermissionKey.userCreate, label: 'models.users.policies.create.label', description: 'models.users.policies.create.description' },
        { id: randomUUID(), key: PermissionKey.userEdit, label: 'models.users.policies.edit.label', description: 'models.users.policies.edit.description' },
        { id: randomUUID(), key: PermissionKey.userDelete, label: 'models.users.policies.delete.label', description: 'models.users.policies.delete.description' },
        { id: randomUUID(), key: PermissionKey.userManageRole, label: 'models.users.policies.manage_roles.label', description: 'models.users.policies.manage_roles.description' },

        { id: randomUUID(), key: PermissionKey.roleView, label: 'models.roles.policies.view.label', description: 'models.roles.policies.view.description' },
        { id: randomUUID(), key: PermissionKey.roleCreate, label: 'models.roles.policies.create.label', description: 'models.roles.policies.create.description' },
        { id: randomUUID(), key: PermissionKey.roleEdit, label: 'models.roles.policies.edit.label', description: 'models.roles.policies.edit.description' },
        { id: randomUUID(), key: PermissionKey.roleDelete, label: 'models.roles.policies.delete.label', description: 'models.roles.policies.delete.description' },

        { id: randomUUID(), key: PermissionKey.newsPostView, label: 'models.news.posts.policies.view.label', description: 'models.news.posts.policies.view.description' },
        { id: randomUUID(), key: PermissionKey.newsPostCreate, label: 'models.news.posts.policies.create.label', description: 'models.news.posts.policies.create.description' },
        { id: randomUUID(), key: PermissionKey.newsPostEdit, label: 'models.news.posts.policies.edit.label', description: 'models.news.posts.policies.edit.description' },
        { id: randomUUID(), key: PermissionKey.newsPostDelete, label: 'models.news.posts.policies.delete.label', description: 'models.news.posts.policies.delete.description' },

        { id: randomUUID(), key: PermissionKey.settingGlobalView, label: 'models.website.settings.policies.global.view.label', description: 'models.website.settings.global.view.description' },
        { id: randomUUID(), key: PermissionKey.settingGlobalEdit, label: 'models.website.settings.policies.global.edit.label', description: 'models.website.settings.global.edit.description' },

        { id: randomUUID(), key: PermissionKey.permissionView, label: 'models.permissions.policies.view.label', description: 'models.permissions.policies.view.description' },
      ])
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
