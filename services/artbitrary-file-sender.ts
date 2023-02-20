import * as bg from "@bgord/node";

import { Mailer } from "./mailer";
import { Env } from "../env";

export class ArbitraryFileSender {
  static send(
    file: Pick<bg.Schema.UploadedFileType, "originalFilename" | "path">
  ) {
    return Mailer.send({
      from: Env.EMAIL_FROM,
      to: Env.EMAIL_TO_DELIVER_TO,
      subject: file.originalFilename,
      text: "Sent from raok.",
      attachments: [{ filename: file.originalFilename, path: file.path }],
    });
  }
}
