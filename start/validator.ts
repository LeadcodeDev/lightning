import { validator, DbRowCheckOptions } from '@ioc:Adonis/Core/Validator'
import Database from '@ioc:Adonis/Lucid/Database'

validator.rule('notExists', async (value: string, compiledOptions: DbRowCheckOptions, options) => {
  const resource = await Database.from(compiledOptions[0].table)
    .where(compiledOptions[0].column, value)
    .first()

  if (resource) {
    options.errorReporter.report(
      options.pointer,
      'notExists',
      'Already exists in database',
      options.arrayExpressionPointer,
    )
  }
}, () => ({
  async: true
}))
