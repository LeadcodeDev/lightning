import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import { randomUUID } from 'node:crypto'

export default class extends BaseSchema {
  protected tableName = 'permissions'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id').primary()
      table.string('label').notNullable()
      table.string('description')
      table.string('section').notNullable()
      table.string('mode').notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })

    this.defer((database) => {
      database.table(this.tableName).multiInsert([
        { id: randomUUID(), label: 'View manager', description: '', section: '', mode: '' },
      ])
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
