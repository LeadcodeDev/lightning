import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { PostMode } from "Domains/news/models/Post";

export default class extends BaseSchema {
  public async up () {
    this.schema.createTable('posts', (table) => {
      table.string('id').primary()
      table.string('mode').notNullable().defaultTo(PostMode.DRAFT)
      table.integer('view_count').unsigned().notNullable().defaultTo(0)
      table.datetime('published_at').defaultTo(this.now())
      table.string('user_id').references('id').inTable('users')
      table.json('picture')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })

    this.schema.createTable('post_translations', (table) => {
      table.increments('id')
      table.timestamps(true)

      table.string('locale').notNullable()
      table.string('title')
      table.text('content', 'longtext')
      table.string('post_id').references('id').inTable('posts').onDelete('CASCADE')
      table.integer('language_id').unsigned().references('id').inTable('languages')
    })

    this.schema.createTable('post_post_tag', (table) => {
      table.increments('id')
      table.string('post_id').references('id').inTable('posts').onDelete('CASCADE')
      table.integer('post_tag_id').references('id').inTable('post_tags').onDelete('CASCADE')
    })
  }

  public async down () {
    this.schema.dropTable('post_post_tag')
    this.schema.dropTable('post_translations')
    this.schema.dropTable('posts')
  }
}
