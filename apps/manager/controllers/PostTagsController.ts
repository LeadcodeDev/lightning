import {HttpContextContract} from "@ioc:Adonis/Core/HttpContext";
import PostTag from "Domains/news/models/PostTag";
import PostTagValidator from "Apps/manager/validators/PostTagValidator";

export default class PostTagsController {
  public async index ({ view, request, bouncer }: HttpContextContract): Promise<string> {
    await bouncer
      .with('ManagerNewsTagPolicy')
      .authorize('viewList')

    const page = request.input('page', 1)
    const limit = request.input('limit', 10)

    const search = request.input('search')
    const tags = await PostTag.query()
      .if(search, (query) => query
        .orWhere('label', 'like', `%${search}%`)
      )
      .paginate(page, limit)

    return view.render('manager::views/news/tags/index', { tags: tags.toJSON() })
  }

  public async create ({ view, bouncer }: HttpContextContract): Promise<string> {
    await bouncer
      .with('ManagerNewsTagPolicy')
      .authorize('create')

    return view.render('manager::views/news/tags/create')
  }

  public async store ({ request, response, bouncer, session, i18n }: HttpContextContract): Promise<void> {
    await bouncer
      .with('ManagerNewsTagPolicy')
      .authorize('create')

    const data = await request.validate(PostTagValidator)
    await PostTag.create(data)

    session.flash('notification', {
      type: 'success',
      message: i18n.formatMessage('models.news.tags.notifications.create')
    })

    return response.redirect().toRoute('manager.news.tags.index')
  }

  public async edit ({ view, params, bouncer }: HttpContextContract): Promise<string> {
    const tag: PostTag = await PostTag.query()
      .where('id', params.id)
      .firstOrFail()

    await bouncer
      .with('ManagerNewsTagPolicy')
      .authorize('update', tag)

    return view.render('manager::views/news/tags/edit', { tag })
  }

  public async update ({ request, response, params, bouncer, session, i18n }: HttpContextContract) {
    const tag: PostTag = await PostTag.query()
      .where('id', params.id)
      .firstOrFail()

    await bouncer
      .with('ManagerNewsTagPolicy')
      .authorize('update', tag)

    const data = await request.validate(PostTagValidator)
    await tag.merge(data).save()

    session.flash('notification', {
      type: 'success',
      message: i18n.formatMessage('models.news.tags.notifications.update')
    })

    return response.redirect().toRoute('manager.news.tags.index')
  }

  public async destroy ({ response, params, bouncer, session, i18n }: HttpContextContract): Promise<void> {
    const tag: PostTag = await PostTag.findOrFail(params.id)

    await bouncer
      .with('ManagerNewsTagPolicy')
      .authorize('delete', tag)

    await tag.delete()

    session.flash('notification', {
      type: 'success',
      message: i18n.formatMessage('models.news.tags.notifications.delete')
    })

    response.redirect().back()
  }
}
