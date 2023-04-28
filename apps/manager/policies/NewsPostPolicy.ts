import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'Domains/users/models/User'
import { PermissionKey } from "Domains/users/models/Permission"
import Post from "Domains/news/models/Post";

export default class NewsPostPolicy extends BasePolicy {
  public async before(user: User | null) {
    if (user && user.isAdmin) {
      return true
    }
  }

	public async viewList(user: User) {
    return await User.hasRole(user, PermissionKey.newsPostView)
  }

	public async view(user: User, post: Post) {
    if (await User.hasRole(user, PermissionKey.newsPostView)) {
      return true
    }

    return user.id === post.userId
  }

	public async create(user: User) {
    return await User.hasRole(user, PermissionKey.newsPostCreate)
  }

	public async update(user: User, post: Post) {
    if (await User.hasRole(user, PermissionKey.newsPostEdit)) {
      return true
    }

    return user.id === post.userId
  }

	public async delete(user: User, post: Post) {
    if (await User.hasRole(user, PermissionKey.newsPostDelete)) {
      return true
    }

    return user.id === post.userId
  }
}
