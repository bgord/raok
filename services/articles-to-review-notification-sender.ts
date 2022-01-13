import { Mailer } from "@bgord/node";

import { Env } from "../env";

const mailer = new Mailer({
  SMTP_HOST: Env.SMTP_HOST,
  SMTP_PORT: Env.SMTP_PORT,
  SMTP_USER: Env.SMTP_USER,
  SMTP_PASS: Env.SMTP_PASS,
});

export class ArticlesToReviewNotificationSender {
  static async send() {
    return mailer.send({
      from: Env.SMTP_USER,
      to: Env.EMAIL_TO_DELIVER_TO,
      subject: "[raok] - new articles to review",
      html: `
        You've a portion of articles to review on raok.
        <br/>
        <a href="https://raok.bgord.me/dashboard" target="_blank" rel="noopener noreferer">
          https://raok.bgord.me/dashboard
        </a>
      `,
    });
  }
}
