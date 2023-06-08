import * as bg from "@bgord/node";

import * as infra from "../infra";

export const Mailer = new bg.Mailer({
  SMTP_HOST: infra.Env.SMTP_HOST,
  SMTP_PORT: infra.Env.SMTP_PORT,
  SMTP_USER: infra.Env.SMTP_USER,
  SMTP_PASS: infra.Env.SMTP_PASS,
});
