import * as bg from "@bgord/node";

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
    const hasFeedlyTokenErrored = VO.FeedlyToken.hasErrored(error);

    if (!hasFeedlyTokenErrored) return false;

    return VO.FeedlyToken.hasExpired();
  }

  static async send(error: unknown) {
    if (!(await FeedlyTokenExpiredNotifier.shouldBeSent(error))) return;

    const now = Date.now();
    await Repos.StatsRepository.updateLastFeedlyTokenExpiredError(now);

    await mailer.send({
      from: Env.EMAIL_FROM,
      to: Env.EMAIL_FOR_NOTIFICATIONS,
      subject: `[raok] - FEEDLY_TOKEN has expired`,
      html: `Check out scripts/feedly-token:regenerate.sh to regenerate the FEEDLY_TOKEN.`,
    });
  }
}
