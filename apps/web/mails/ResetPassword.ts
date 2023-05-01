import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import View from "@ioc:Adonis/Core/View";
import mjml from 'mjml'
import User from "Domains/users/models/User";
import Env from "@ioc:Adonis/Core/Env";

export default class ResetPassword extends BaseMailer {
  constructor(
    private defaultEmailSettings,
    private user: User,
    private resetUrl: string,
    private subject: string
  ) {
    super();
  }

  public view = mjml(View.renderSync('web::views/mails/ResetPassword', {
    username: this.user.username,
    resetUrl: this.resetUrl,
    ...this.defaultEmailSettings
  }))

  public prepare(message: MessageContract) {
    message
      .from(Env.get('EMAIL_ADDRESS'))
      .to(this.user.email)
      .subject(this.subject)
      .html(this.view.html)
  }
}
