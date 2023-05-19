import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Post from "Domains/news/models/Post";
import Permission from "Domains/users/models/Permission";
import PostValidator from "Apps/manager/validators/PostValidator";
import PostTranslation from "Domains/news/models/PostTranslation";
import PostTag from "Domains/news/models/PostTag";
import {ResponsiveAttachment} from "adonis-responsive-attachment/build/src/Attachment";

export default class PostsController {
  public async index ({ view, request, bouncer }: HttpContextContract): Promise<string> {
    await bouncer
      .with('ManagerNewsPostPolicy')
      .authorize('viewList')

    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const search = request.input('search')
    const posts = await Post.query()
      .if(search, (query) => query
        .orWhere('id', '=', search)
        .orWhere('mode', '=', search)
      )
      .orderBy('created_at', 'desc')
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

  public async store ({ auth, request, response, session, i18n, bouncer }: HttpContextContract): Promise<void> {
    await bouncer
      .with('ManagerNewsPostPolicy')
      .authorize('create')

    const data = await request.validate(PostValidator)

    const post: Post = await Post.create({})

    const picture = data.picture
      ? await ResponsiveAttachment.fromFile(data.picture)
      : post.picture

    await Promise.all([
      post.merge({ ...data, picture, userId: auth.user?.id }).save(),
      PostTranslation.synchronize(post, data.translations),
      Post.syncTags(post, request)
    ])

    session.flash('notification', {
      type: 'success',
      message: i18n.formatMessage('models.news.posts.notifications.create')
    })

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

  public async update ({ request, response, params, i18n, session, bouncer }: HttpContextContract) {
    const post: Post = await Post.query()
      .where('id', params.id)
      .firstOrFail()

    await bouncer
      .with('ManagerNewsPostPolicy')
      .authorize('update', post)

    const data = await request.validate(PostValidator)
    const picture = data.picture
      ? await ResponsiveAttachment.fromFile(data.picture)
      : post.picture

    await Promise.all([
      post.merge({ ...data, picture }).save(),
      PostTranslation.synchronize(post, data.translations),
      Post.syncTags(post, request)
    ])

    session.flash('notification', {
      type: 'success',
      message: i18n.formatMessage('models.news.posts.notifications.update')
    })

    return response.redirect().toRoute('manager.news.posts.index')
  }

  public async destroy ({ response, params, session, i18n, bouncer }: HttpContextContract): Promise<void> {
    const post: Post = await Post.findOrFail(params.id)

    await bouncer
      .with('ManagerNewsPostPolicy')
      .authorize('delete', post)

    session.flash('notification', {
      type: 'success',
      message: i18n.formatMessage('models.news.posts.notifications.delete')
    })

    await post.delete()

    response.redirect().back()
  }
}
