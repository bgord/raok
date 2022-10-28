import * as bg from "@bgord/node";

import { Env } from "../env";

const mailer = new bg.Mailer({
  SMTP_HOST: Env.SMTP_HOST,
  SMTP_PORT: Env.SMTP_PORT,
  SMTP_USER: Env.SMTP_USER,
  SMTP_PASS: Env.SMTP_PASS,
});

export class ArbitraryFileSender {
  static send(
    file: Pick<bg.Schema.UploadedFileType, "originalFilename" | "path">
  ) {
    return mailer.send({
      from: Env.EMAIL_FROM,
      to: Env.EMAIL_TO_DELIVER_TO,
      subject: file.originalFilename,
      text: "Sent from raok.",
      attachments: [{ filename: file.originalFilename, path: file.path }],
    });
  }
}
