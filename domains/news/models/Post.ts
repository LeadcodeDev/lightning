import {DateTime} from 'luxon'
import {BaseModel, column, HasMany, hasMany, ManyToMany, manyToMany, computed, beforeCreate} from '@ioc:Adonis/Lucid/Orm'
import {attachment, AttachmentContract} from "@ioc:Adonis/Addons/AttachmentLite";
import PostTag from "Domains/news/models/PostTag";
import {randomUUID} from "node:crypto";
import PostTranslation from "Domains/news/models/PostTranslation";

export enum PostMode {
  DRAFT = 'draft',
  PUBLISH = 'publish',
}

export default class Post extends BaseModel {
  @column({isPrimary: true})
  public id: string

  @column()
  public userId: string

  @column()
  public mode: PostMode

  @column()
  public viewCount: number

  @manyToMany(() => PostTag)
  public tags: ManyToMany<typeof PostTag>

  @attachment({folder: 'news', preComputeUrl: true})
  public picture: AttachmentContract

  @column.dateTime()
  public publishedAt: DateTime

  @column.dateTime({autoCreate: true})
  public createdAt: DateTime

  @column.dateTime({autoCreate: true, autoUpdate: true})
  public updatedAt: DateTime

  @computed()
  public get title (): string {
    return `news.articles.${this.id}.title`
  }

  @computed()
  public get content (): string {
    return `news.articles.${this.id}.content`
  }

  @computed()
  public get state() {
    if (this.mode === 'draft') {
      return 'models.news.posts.keywords.state.draft'
    }

    if (this.mode === 'publish' && this.publishedAt <= DateTime.now()) {
      return 'models.news.posts.keywords.state.published'
    }

    if (this.mode === 'publish' && this.publishedAt > DateTime.now()) {
      return 'models.news.posts.keywords.state.waiting_for_publish'
    }
  }

  @hasMany(() => PostTranslation)
  public translations: HasMany<typeof PostTranslation>

  @beforeCreate()
  public static async generateUid(post: Post): Promise<void> {
    post.id = randomUUID()
  }
}
