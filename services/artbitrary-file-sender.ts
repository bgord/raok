import * as bg from "@bgord/node";

import * as infra from "../infra";

export class ArbitraryFileSender {
  static send(
    file: Pick<bg.Schema.UploadedFileType, "originalFilename" | "path">
  ) {
    return infra.Mailer.send({
      from: infra.Env.EMAIL_FROM,
      to: infra.Env.EMAIL_TO_DELIVER_TO,
      subject: file.originalFilename,
      text: "Sent from raok.",
      attachments: [{ filename: file.originalFilename, path: file.path }],
    });
  }
}
