import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'Domains/users/models/User'
import { PermissionKey } from "Domains/users/models/Permission"
import PostTag from "Domains/news/models/PostTag";

export default class NewsTagPolicy extends BasePolicy {
  public async before(user: User | null) {
    if (user && user.isAdmin) {
      return true
    }
  }

	public async viewList(user: User) {
    return await User.hasRole(user, PermissionKey.newsTagView)
  }

	public async view(user: User, _: PostTag) {
    return await User.hasRole(user, PermissionKey.newsTagView)
  }

	public async create(user: User) {
    return await User.hasRole(user, PermissionKey.newsTagCreate)
  }

	public async update(user: User, _: PostTag) {
    return await User.hasRole(user, PermissionKey.newsTagEdit)
  }

	public async delete(user: User, _: PostTag) {
    return await User.hasRole(user, PermissionKey.newsTagDelete)
  }
}
