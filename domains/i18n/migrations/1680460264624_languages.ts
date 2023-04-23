import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'languages'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.timestamps(true)

      table.string('name').notNullable()
      table.string('code').notNullable()
    })

    this.defer(async (database) => {
      await database.table(this.tableName).multiInsert([
        { name: 'Français', code: 'fr' },
        { name: 'Anglais', code: 'en' }
      ])
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
