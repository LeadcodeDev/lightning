import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Post from "Domains/news/models/Post";
import Permission from "Domains/users/models/Permission";
import PostValidator from "Apps/manager/validators/PostValidator";
import PostTranslation from "Domains/news/models/PostTranslation";
import PostTag from "Domains/news/models/PostTag";

export default class PostsController {
  public async index ({ view, request, bouncer }: HttpContextContract): Promise<string> {
    await bouncer
      .with('ManagerNewsPostPolicy')
      .authorize('viewList')

    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const posts = await Post.query()
      .paginate(page, limit)

    return view.render('manager::views/news/posts/index', { posts: posts.toJSON() })
  }

  public async create ({ view, bouncer }: HttpContextContract): Promise<string> {
    await bouncer
      .with('ManagerNewsPostPolicy')
      .authorize('create')

    const tags: PostTag[] = await PostTag.all()
    const permissions: Permission[] = await Permission.all()

    return view.render('manager::views/news/posts/create', { permissions, tags })
  }

  public async store ({ request, response, bouncer }: HttpContextContract): Promise<void> {
    await bouncer
      .with('ManagerNewsPostPolicy')
      .authorize('create')

    const data = await request.validate(PostValidator)

    const post: Post = await Post.create({})

    await Promise.all([
      PostTranslation.synchronize(post, data.translations),
      Post.syncTags(post, request)
    ])

    return response.redirect().toRoute('manager.news.posts.index')
  }

  public async edit ({ view, params, bouncer }: HttpContextContract): Promise<string> {
    const post: Post = await Post.query()
      .where('id', params.id)
      .preload('translations', (query) => query.preload('language'))
      .preload('tags')
      .firstOrFail()

    await bouncer
      .with('ManagerNewsPostPolicy')
      .authorize('update', post)

    const tags = await PostTag.all()

    return view.render('manager::views/news/posts/edit', { post, tags })
  }

  public async update ({ request, response, params, bouncer }: HttpContextContract) {
    const post: Post = await Post.query()
      .where('id', params.id)
      .firstOrFail()

    await bouncer
      .with('ManagerNewsPostPolicy')
      .authorize('update', post)

    const data = await request.validate(PostValidator)

    await Promise.all([
      PostTranslation.synchronize(post, data.translations),
      Post.syncTags(post, request)
    ])

    return response.redirect().toRoute('manager.news.posts.index')
  }

  public async destroy ({ response, params, bouncer }: HttpContextContract): Promise<void> {
    const post: Post = await Post.findOrFail(params.id)

    await bouncer
      .with('ManagerNewsPostPolicy')
      .authorize('delete', post)

    await post.delete()

    response.redirect().back()
  }
}
