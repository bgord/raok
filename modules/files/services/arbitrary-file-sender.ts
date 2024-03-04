import * as bg from "@bgord/node";

import * as infra from "../../../infra";

/** @public */
export class ArbitraryFileSender {
  static send(
    file: Pick<bg.Schema.UploadedFileType, "originalFilename" | "path">,
    to: bg.Schema.EmailType
  ) {
    return infra.Mailer.send({
      from: infra.Env.EMAIL_FROM,
      to,
      subject: file.originalFilename,
      text: "Sent from raok.",
      attachments: [{ filename: file.originalFilename, path: file.path }],
    });
  }
}
