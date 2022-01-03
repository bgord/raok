import { Mailer } from "@bgord/node";

import * as VO from "../value-objects";
import * as Services from "../services";

import { Env } from "../env";

const mailer = new Mailer({
  SMTP_HOST: Env.SMTP_HOST,
  SMTP_PORT: Env.SMTP_PORT,
  SMTP_USER: Env.SMTP_USER,
  SMTP_PASS: Env.SMTP_PASS,
});

export class NewspaperSender {
  static async send(newspaperId: VO.NewspaperType["id"]) {
    const path = Services.NewspaperFile.getPaths(newspaperId).mobi;

    return mailer.send({
      from: Env.SMTP_USER,
      to: Env.EMAIL_TO_DELIVER_TO,
      subject: "Newspaper",
      text: "Sent from raok.",
      attachments: [{ filename: "newspaper.mobi", path }],
    });
  }
}
