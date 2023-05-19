import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {column, beforeSave, BaseModel, hasMany, HasMany, manyToMany, ManyToMany} from '@ioc:Adonis/Lucid/Orm'
import {beforeCreate, computed} from "@adonisjs/lucid/build/src/Orm/Decorators";
import { randomUUID } from 'node:crypto'
import Token from "Domains/users/models/Token";
import Role from "Domains/users/models/Role";
import { RequestContract } from '@ioc:Adonis/Core/Request'
import Permission, {PermissionKey} from "Domains/users/models/Permission";
import {responsiveAttachment, ResponsiveAttachmentContract} from "@ioc:Adonis/Addons/ResponsiveAttachment";

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public email: string

  @column()
  public firstname: string

  @column()
  public lastname: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken: string | null

  @column()
  public hasEmailVerified: boolean = false

  @column()
  public isAdmin: boolean = false

  @column()
  public isLocked: boolean = false

  @responsiveAttachment({
    preComputeUrls: true,
    folder: 'avatars',
  })
  public avatar: ResponsiveAttachmentContract

  @column.dateTime({
    autoCreate: true,
    consume: (value: string) => DateTime.fromJSDate(new Date(value)),
  })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @computed()
  public get username (): string {
    return `${this.firstname} ${this.lastname}`
  }

  @computed()
  public get roleIds (): string[] {
    return this.roles.map((role: Role) => role.id)
  }

  @manyToMany(() => Role)
  public roles: ManyToMany<typeof Role>

  @hasMany(() => Token)
  public tokens: HasMany<typeof Token>

  @hasMany(() => Token, {
    onQuery: query => query.where('type', 'PASSWORD_RESET')
  })
  public passwordResetTokens: HasMany<typeof Token>

  @hasMany(() => Token, {
    onQuery: query => query.where('type', 'VERIFY_EMAIL')
  })
  public verifyEmailTokens: HasMany<typeof Token>

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

  public static async syncRoles (user: User, request: RequestContract): Promise<void> {
    const roles = request.input('roles', [])
    if (roles) {
      await user.related('roles').sync(Array.isArray(roles) ? [...roles] : [roles])
    }
  }

  public static async hasRole (user: User, ...permissions: PermissionKey[]): Promise<boolean> {
    await user.load('roles', (query) => query.preload('permissions'))

    const permissionKeys = user.roles.flatMap((role: Role) => {
      return role.permissions.map((permission: Permission) => permission.key)
    })

    return permissions.some((permission) => {
      return permissionKeys.includes(permission)
    })
  }

  public static async getHighRole (user: User): Promise<Role | undefined> {
    await user.load('roles')

    if (!user.roles.length) {
      return
    }

    return user.roles.reduce((accumulator: Role, role: Role) => {
      if (role.power > accumulator.power) {
        accumulator = role
      }

      return accumulator
    })
  }
}
