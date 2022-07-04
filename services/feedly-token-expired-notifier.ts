import { Mailer } from "@bgord/node";

import { Env } from "../env";

const mailer = new Mailer({
  SMTP_HOST: Env.SMTP_HOST,
  SMTP_PORT: Env.SMTP_PORT,
  SMTP_USER: Env.SMTP_USER,
  SMTP_PASS: Env.SMTP_PASS,
});

export class FeedlyTokenExpiredNotifier {
  static async send() {
    return mailer.send({
      from: Env.EMAIL_FROM,
      to: Env.EMAIL_FOR_NOTIFICATIONS,
      subject: `[raok] - feedly token has expired`,
      html: `Check https://feedly.com/v3/auth/dev to generate it.`,
    });
  }
}
