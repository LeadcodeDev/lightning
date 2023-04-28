import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'Domains/users/models/User'
import { PermissionKey } from "Domains/users/models/Permission"

export default class ManagerPolicy extends BasePolicy {
  public async before(user: User | null) {
    if (user && user.isAdmin) {
      return true
    }
  }

	public async userSection (user: User) {
    return User.hasRole(user, PermissionKey.userView, PermissionKey.roleView, PermissionKey.permissionView)
  }

  public async newsSection (user: User) {
    return User.hasRole(user, PermissionKey.newsPostView)
  }

  public async settingSection (user: User) {
    return User.hasRole(user, PermissionKey.settingGlobalView)
  }

  public async viewDashboard (user: User) {
    return User.hasRole(user, PermissionKey.manageAccess)
  }
}
