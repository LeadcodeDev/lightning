import { validator } from '@ioc:Adonis/Core/Validator'

validator.rule('normalizeManyRelations', async (value: string | number | string[] | number[]) => {
  if (!Array.isArray(value)) {
    return value ? [value] : []
  }
}, () => ({
  async: true
}))
