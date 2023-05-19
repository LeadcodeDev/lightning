import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'Domains/users/models/User'
import Permission, { PermissionKey } from "Domains/users/models/Permission"

export default class PermissionPolicy extends BasePolicy {
  public async before(user: User | null) {
    if (user && user.isAdmin) {
      return true
    }
  }

	public async viewList(user: User) {
    return User.hasRole(user, PermissionKey.permissionView)
  }

	public async view(user: User, _: Permission) {
    return User.hasRole(user, PermissionKey.permissionView);
  }
}
