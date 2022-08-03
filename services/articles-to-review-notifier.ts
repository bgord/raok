import { Mailer, Reporter } from "@bgord/node";

import * as Aggregates from "../aggregates";

import * as Repos from "../repositories";
import * as VO from "../value-objects";
import { Env } from "../env";

const mailer = new Mailer({
  SMTP_HOST: Env.SMTP_HOST,
  SMTP_PORT: Env.SMTP_PORT,
  SMTP_USER: Env.SMTP_USER,
  SMTP_PASS: Env.SMTP_PASS,
});

export class ArticlesToReviewNotifier {
  UTC_HOUR: VO.HourType;

  numberOfArticlesToReview = 0;

  constructor(settings: Aggregates.Settings) {
    this.UTC_HOUR = settings.articlesToReviewNotificationHour;
  }

  async build() {
    this.numberOfArticlesToReview =
      await Repos.ArticleRepository.getNumberOfNonProcessed();

    return this;
  }

  private shouldBeSent() {
    if (this.numberOfArticlesToReview === 0) return false;

    const now = new Date();

    const hour = now.getUTCHours();
    const minute = now.getUTCMinutes();

    if (hour !== this.UTC_HOUR || minute !== 0) return false;

    return true;
  }

  async send() {
    if (!this.shouldBeSent()) return;

    await mailer.send({
      from: Env.EMAIL_FROM,
      to: Env.EMAIL_FOR_NOTIFICATIONS,
      subject: `[raok] - ${this.numberOfArticlesToReview} articles to review`,
      html: `
        You've ${this.numberOfArticlesToReview} articles to review on raok.
        <br/>
        <br/>
        <a href="https://raok.bgord.me/dashboard" target="_blank" rel="noopener noreferer">
          Go to dashboard
        </a>
      `,
    });

    Reporter.success("Articles to review notification sent");
  }
}
