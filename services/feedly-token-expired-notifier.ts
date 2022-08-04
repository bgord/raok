import * as bg from "@bgord/node";
import { AxiosError } from "axios";

import * as Repos from "../repositories";
import * as VO from "../value-objects";
import { Env } from "../env";

const mailer = new bg.Mailer({
  SMTP_HOST: Env.SMTP_HOST,
  SMTP_PORT: Env.SMTP_PORT,
  SMTP_USER: Env.SMTP_USER,
  SMTP_PASS: Env.SMTP_PASS,
});

export class FeedlyTokenExpiredNotifier {
  private static async shouldBeSent(error: unknown): Promise<boolean> {
    const hasTokenExpired =
      FeedlyTokenExpiredNotifier.isAxiosError(error) &&
      error.response?.status === 401;

    if (!hasTokenExpired) return false;

    const stats = await Repos.StatsRepository.getAll();
    const lastFeedlyTokenExpiredError = stats.lastFeedlyTokenExpiredError;

    // First lastFeedlyTokenExpiredError happening
    if (lastFeedlyTokenExpiredError === null) return true;

    const now = Date.now();
    const msSinceLastError = now - lastFeedlyTokenExpiredError;

    const hasLastErrorHappenedBeforeCurrentTokenLifespan =
      msSinceLastError > bg.Time.Days(VO.FEEDLY_TOKEN_EXPIRATION_DAYS).toMs();

    return hasLastErrorHappenedBeforeCurrentTokenLifespan;
  }

  private static isAxiosError(error: unknown): error is AxiosError {
    return error instanceof Error && error && "isAxiosError" in error;
  }

  static async send(error: unknown) {
    if (!(await FeedlyTokenExpiredNotifier.shouldBeSent(error))) return;

    const now = Date.now();
    await Repos.StatsRepository.updateLastFeedlyTokenExpiredError(now);

    return mailer.send({
      from: Env.EMAIL_FROM,
      to: Env.EMAIL_FOR_NOTIFICATIONS,
      subject: `[raok] - feedly token has expired`,
      html: `Check https://feedly.com/v3/auth/dev to generate it, remember to change the env files.`,
    });
  }
}
