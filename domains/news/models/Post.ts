import {DateTime} from 'luxon'
import {BaseModel, column, HasMany, hasMany, ManyToMany, manyToMany, computed, beforeCreate} from '@ioc:Adonis/Lucid/Orm'
import PostTag from "Domains/news/models/PostTag";
import {randomUUID} from "node:crypto";
import PostTranslation from "Domains/news/models/PostTranslation";
import {RequestContract} from "@ioc:Adonis/Core/Request";
import {responsiveAttachment, ResponsiveAttachmentContract} from "@ioc:Adonis/Addons/ResponsiveAttachment";

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

  @responsiveAttachment({
    folder: 'news/posts',
    preComputeUrls: true
  })
  public picture: ResponsiveAttachmentContract

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

  @computed()
  public get tagIds (): number[] {
    return this.tags.map((tag: PostTag) => tag.id)
  }

  @hasMany(() => PostTranslation)
  public translations: HasMany<typeof PostTranslation>

  @beforeCreate()
  public static async generateUid(post: Post): Promise<void> {
    post.id = randomUUID()
  }

  public static async syncTags (post: Post, request: RequestContract): Promise<void> {
    const roles = request.input('tags', [])
    if (roles) {
      await post.related('tags').sync(Array.isArray(roles) ? [...roles] : [roles])
    }
  }
}
