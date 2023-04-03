import { BaseCommand } from '@adonisjs/core/build/standalone'

export default class MakeUser extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'make:user'
  public static description = 'Create a new user'

  public static settings = {
    loadApp: true,
    stayAlive: false,
  }

  public async run () {
    const { default: User } = await import('Domains/users/models/User')

    const username = await this.prompt.ask('Enter username')
    const email = await this.prompt.ask('Choose email')
    const password = await this.prompt.secure('Choose account password')
    const passwordConfirmation = await this.prompt.secure('Confirm account password')

    if (password !== passwordConfirmation) {
      this.logger.fatal('Passwords are not identical')
      return
    }

    await User.create({ username, email, password })

    this.logger.success('User was create')
  }
}
