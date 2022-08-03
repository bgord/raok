import { Mailer } from "@bgord/node";
import { AxiosError } from "axios";

import { Env } from "../env";

const mailer = new Mailer({
  SMTP_HOST: Env.SMTP_HOST,
  SMTP_PORT: Env.SMTP_PORT,
  SMTP_USER: Env.SMTP_USER,
  SMTP_PASS: Env.SMTP_PASS,
});

export class FeedlyTokenExpiredNotifier {
  private static shouldBeSent(error: unknown): boolean {
    if (FeedlyTokenExpiredNotifier.isAxiosError(error)) {
      return error.response?.status === 401;
    }
    return false;
  }

  private static isAxiosError(error: unknown): error is AxiosError {
    return error instanceof Error && error && "isAxiosError" in error;
  }

  static async send(error: unknown) {
    if (!FeedlyTokenExpiredNotifier.shouldBeSent(error)) return;

    return mailer.send({
      from: Env.EMAIL_FROM,
      to: Env.EMAIL_FOR_NOTIFICATIONS,
      subject: `[raok] - feedly token has expired`,
      html: `Check https://feedly.com/v3/auth/dev to generate it.`,
    });
  }
}
