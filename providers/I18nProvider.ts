import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import {I18nApplicationsLoader} from "Services/I18nApplicationsLoader";
import {I18nPostsLoader} from "Services/I18nPostsLoader";

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
  }

  public async boot() {
    const I18n = this.app.container.resolveBinding('Adonis/Addons/I18n')
    const database = this.app.container.resolveBinding('Adonis/Lucid/Database')

    I18n.extend('applications', 'loader', (_, config) => {
      return new I18nApplicationsLoader(config)
    })

    I18n.extend('posts', 'loader', (_) => {
      return new I18nPostsLoader(database)
    })
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
