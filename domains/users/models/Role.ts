import { DateTime } from 'luxon'
import { column, BaseModel, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import {beforeCreate, computed} from "@adonisjs/lucid/build/src/Orm/Decorators";
import { randomUUID } from 'node:crypto'
import Permission from "Domains/users/models/Permission";
import {RequestContract} from "@ioc:Adonis/Core/Request";

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public label: string

  @column()
  public power: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @computed()
  public get permissionIds (): String[] {
    return this.permissions.map((permission: Permission) => permission.id)
  }

  @manyToMany(() => Permission)
  public permissions: ManyToMany<typeof Permission>

  @beforeCreate()
  public static async generateUid (role: Role): Promise<void> {
    role.id = randomUUID()
  }

  public static async syncPermissions (role: Role, request: RequestContract): Promise<void> {
    const roles = request.input('permissions', [])
    if (roles) {
      await role.related('permissions').sync(Array.isArray(roles) ? [...roles] : [roles])
    }
  }
}
