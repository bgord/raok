import * as bg from "@bgord/node";

import * as Settings from "../../settings";

import * as infra from "../../../infra";
import { ArticleRepository } from "../repositories/article-repository";

const mailer = new bg.Mailer({
  SMTP_HOST: infra.Env.SMTP_HOST,
  SMTP_PORT: infra.Env.SMTP_PORT,
  SMTP_USER: infra.Env.SMTP_USER,
  SMTP_PASS: infra.Env.SMTP_PASS,
});

/** @public */
export class ArticlesToReviewNotifier {
  UTC_HOUR: bg.Schema.HourType;

  numberOfArticlesToReview = 0;

  isArticlesToReviewNotificationEnabled = false;

  constructor(settings: Settings.Aggregates.Settings) {
    this.UTC_HOUR = settings.articlesToReviewNotificationHour;
    this.isArticlesToReviewNotificationEnabled =
      settings.isArticlesToReviewNotificationEnabled;
  }

  async build() {
    this.numberOfArticlesToReview =
      await ArticleRepository.getNumberOfNonProcessed();

    return this;
  }

  private shouldBeSent() {
    if (this.numberOfArticlesToReview < 10) return false;

    if (!this.isArticlesToReviewNotificationEnabled) return false;

    const now = new Date();

    const hour = now.getUTCHours();
    const minute = now.getUTCMinutes();

    if (hour !== this.UTC_HOUR || minute !== 0) return false;

    return true;
  }

  async send() {
    if (!this.shouldBeSent()) return;

    await mailer.send({
      from: infra.Env.EMAIL_FROM,
      to: infra.Env.EMAIL_FOR_NOTIFICATIONS,
      subject: `⌛ [RAOK] - ${this.numberOfArticlesToReview} new articles to review`,
      html: `
        You have got ${this.numberOfArticlesToReview} articles to review on raok.
        <br/>
        <br/>
        <a href="https://raok.bgord.me/dashboard" target="_blank" rel="noopener noreferer">
          Go to dashboard
        </a>
      `,
    });

    infra.logger.info({
      message: "Articles to review notification sent",
      operation: "articles_to_review_notification_sent",
      metadata: { count: this.numberOfArticlesToReview },
    });
  }
}
