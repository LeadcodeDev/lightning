import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'Domains/users/models/User'
import { PermissionKey } from "Domains/users/models/Permission"
import WebsiteSetting from "Domains/website/models/WebsiteSetting";

export default class SettingGlobalPolicy extends BasePolicy {
  public async before(user: User | null) {
    if (user && user.isAdmin) {
      return true
    }
  }

	public async viewList(user: User) {
    return User.hasRole(user, PermissionKey.settingGlobalView)
  }

	public async view(user: User, _: WebsiteSetting) {
    return User.hasRole(user, PermissionKey.settingGlobalView)
  }

	public async update(user: User, _: WebsiteSetting) {
    return User.hasRole(user, PermissionKey.settingGlobalEdit)
  }
}
