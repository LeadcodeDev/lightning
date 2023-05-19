import {BaseModel, belongsTo, BelongsTo, column} from '@ioc:Adonis/Lucid/Orm'
import {DateTime} from "luxon";
import Language from "Domains/i18n/models/Language";
import Post from "Domains/news/models/Post";
import I18n from "@ioc:Adonis/Addons/I18n";
// import I18n from "@ioc:Adonis/Addons/I18n";

export default class PostTranslation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public locale: string

  @column()
  public title: string

  @column()
  public content: string

  @column()
  public postId: string

  @column()
  public languageId: number

  @belongsTo(() => Language)
  public language: BelongsTo<typeof Language>

  @column.dateTime({autoCreate: true})
  public createdAt: DateTime

  @column.dateTime({autoCreate: true, autoUpdate: true})
  public updatedAt: DateTime

  public static async synchronize (post: Post, translations): Promise<void> {
    const languages = await Language.all()

    await PostTranslation.updateOrCreateMany(['locale', 'languageId'],
      Object.entries(translations).map(([lang, payload]: [string, any]) => ({
        title: payload.title,
        content: payload.content,
        locale: `news.articles.${post.id}`,
        postId: post.id,
        languageId: languages.find((language) => language.code === lang)?.id
      }))
    )

    await I18n.reloadTranslations()
  }
}
