import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'Domains/users/models/User'
import { PermissionKey } from "Domains/users/models/Permission"
import Role from "Domains/users/models/Role";

export default class RolePolicy extends BasePolicy {
  public async before(user: User | null) {
    if (user && user.isAdmin) {
      return true
    }
  }

	public async viewList(user: User) {
    return User.hasRole(user, PermissionKey.roleView)
  }

	public async view(user: User, role: Role) {
    const higherRole: Role = await User.getHighRole(user)

    return higherRole.power > role.power
      && await User.hasRole(user, PermissionKey.roleView);
  }

	public async create(user: User) {
    return User.hasRole(user, PermissionKey.roleCreate)
  }

	public async update(user: User, role: Role) {
    const higherRole: Role = await User.getHighRole(user)

    return higherRole.power > role.power
      && await User.hasRole(user, PermissionKey.roleEdit);
  }

	public async delete(user: User, role: Role) {
    const higherRole: Role = await User.getHighRole(user)

    return higherRole.power > role.power
      && await User.hasRole(user, PermissionKey.roleDelete);
  }
}
