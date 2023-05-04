import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table.string('email', 255).notNullable().unique()
      table.string('firstname').notNullable()
      table.string('lastname').notNullable()
      table.string('password', 180).notNullable()
      table.string('remember_me_token').nullable()
      table.boolean('has_email_verified').notNullable().defaultTo(false)
      table.boolean('is_admin').notNullable().defaultTo(false)
      table.boolean('is_locked').notNullable().defaultTo(false)
      table.json('avatar').nullable()

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
