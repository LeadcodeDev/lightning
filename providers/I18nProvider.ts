import { ApplicationContract } from '@ioc:Adonis/Core/Application'
import {I18nApplicationsLoader} from "Services/I18nApplicationsLoader";

export default class AppProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
  }

  public async boot() {
    const I18n = this.app.container.resolveBinding('Adonis/Addons/I18n')

    I18n.extend('applications', 'loader', (_, config) => {
      return new I18nApplicationsLoader(config)
    })
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
