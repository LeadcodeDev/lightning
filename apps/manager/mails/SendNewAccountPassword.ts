import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import View from "@ioc:Adonis/Core/View";
import mjml from 'mjml'
import User from "Domains/users/models/User";

export default class SendNewAccountPassword extends BaseMailer {
  constructor(
    private defaultEmailSettings,
    private user: User,
    private password: string,
    private confirmEmailUrl: string
  ) {
    super();
  }

  public view = mjml(View.renderSync('manager::views/mails/SendNewAccountPassword', {
    username: this.user.username,
    email: this.user.email,
    password: this.password,
    confirmEmailUrl: this.confirmEmailUrl,
    ...this.defaultEmailSettings
  }))

  public prepare(message: MessageContract) {
    message
      .from('noreply@leadcode.fr')
      .to(this.user.email)
      .subject('Confirmation de création de compte')
      .html(this.view.html)
  }
}
