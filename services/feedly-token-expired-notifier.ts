import * as bg from "@bgord/node";

import * as Repos from "../repositories";
import * as VO from "../value-objects";
import * as infra from "../infra";

const mailer = new bg.Mailer({
  SMTP_HOST: infra.Env.SMTP_HOST,
  SMTP_PORT: infra.Env.SMTP_PORT,
  SMTP_USER: infra.Env.SMTP_USER,
  SMTP_PASS: infra.Env.SMTP_PASS,
});

export class FeedlyTokenExpiredNotifier {
  private static async shouldBeSent(error: unknown): Promise<boolean> {
    const hasFeedlyTokenErrored = VO.FeedlyToken.hasErrored(error);

    if (!hasFeedlyTokenErrored) return false;

    const stats = await Repos.StatsRepository.getAll();

    return VO.FeedlyToken.hasExpired(stats.lastFeedlyTokenExpiredError);
  }

  static async handle(error: unknown) {
    if (!(await FeedlyTokenExpiredNotifier.shouldBeSent(error))) return;

    const now = Date.now();
    await Repos.StatsRepository.updateLastFeedlyTokenExpiredError(now);

    await mailer.send({
      from: infra.Env.EMAIL_FROM,
      to: infra.Env.EMAIL_FOR_NOTIFICATIONS,
      subject: `[raok] - FEEDLY_TOKEN has expired`,
      html: `Check out scripts/feedly-token:regenerate.sh to regenerate the FEEDLY_TOKEN.`,
    });
  }
}
