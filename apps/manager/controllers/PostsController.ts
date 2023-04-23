import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import Post from "Domains/news/models/Post";
import Permission from "Domains/users/models/Permission";
import PostValidator from "Apps/manager/validators/PostValidator";
import PostTranslation from "Domains/news/models/PostTranslation";

export default class PostsController {
  public async index ({ view, request }: HttpContextContract): Promise<string> {
    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const posts = await Post.query()
      .paginate(page, limit)

    return view.render('manager::views/news/posts/index', { posts: posts.toJSON() })
  }

  public async create ({ view }: HttpContextContract): Promise<string> {
    const permissions = await Permission.all()

    return view.render('manager::views/news/posts/create', { permissions })
  }

  public async store ({ request, response }: HttpContextContract): Promise<void> {
    const data = await request.validate(PostValidator)

    const post: Post = await Post.create({})

    await PostTranslation.synchronize(post, data.translations)

    return response.redirect().toRoute('manager.news.posts.index')
  }

  public async edit ({ view, params }: HttpContextContract): Promise<string> {
    const post: Post = await Post.query()
      .where('id', params.id)
      .preload('translations', (query) => query.preload('language'))
      .preload('tags')
      .firstOrFail()

    return view.render('manager::views/news/posts/edit', { post })
  }

  public async update ({ request, response, params }: HttpContextContract) {
    const data = await request.validate(PostValidator)
    const post: Post = await Post.query()
      .where('id', params.id)
      .firstOrFail()

    await PostTranslation.synchronize(post, data.translations)

    return response.redirect().toRoute('manager.news.posts.index')
  }

  public async destroy ({ response, params }: HttpContextContract): Promise<void> {
    const post: Post = await Post.findOrFail(params.id)
    await post.delete()

    response.redirect().back()
  }
}
