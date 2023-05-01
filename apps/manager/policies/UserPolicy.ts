import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'Domains/users/models/User'
import { PermissionKey } from "Domains/users/models/Permission"

export default class UserPolicy extends BasePolicy {
  public async before(user: User | null) {
    if (user && user.isAdmin) {
      return true
    }
  }

	public async viewList(user: User) {
    return User.hasRole(user, PermissionKey.userView)
  }

	public async view(user: User, target: User) {
    if (user.id === target.id) {
      return true
    }

    return User.hasRole(user, PermissionKey.userView)
  }

	public async create(user: User) {
    return User.hasRole(user, PermissionKey.userCreate)
  }

	public async update(user: User, target: User) {
    if (user.id === target.id) {
      return true
    }

    return User.hasRole(user, PermissionKey.userEdit)
  }

	public async delete(user: User, target: User) {
    if (user.id === target.id) {
      return true
    }

    return User.hasRole(user, PermissionKey.userDelete)
  }
}
