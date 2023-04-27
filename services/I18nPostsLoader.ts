import type { DatabaseContract } from '@ioc:Adonis/Lucid/Database'
import type { Translations, LoaderContract } from '@ioc:Adonis/Addons/I18n'

export type DatabaseLoaderConfig = {
  enabled: boolean
  table: string
}

/**
 * Uses the filesystem to load messages from the JSON
 * files
 */
export class I18nPostsLoader implements LoaderContract {
  constructor(private database: DatabaseContract) {}

  public async load() {
    if (await this.database.connection().schema.hasTable('post_translations')) {
      const rows = await this.database.from('post_translations')
        .innerJoin('languages', 'languages.id', '=','post_translations.language_id')

      return rows.reduce<Translations>((result, row) => {
        result[row.code] = result[row.code] || {}

        result[row.code][row.locale + '.title'] = row.title
        result[row.code][row.locale + '.content'] = row.content

        return result
      }, {})
    }

    return {}
  }
}
