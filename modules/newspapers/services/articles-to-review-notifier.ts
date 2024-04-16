import * as bg from "@bgord/node";

import * as infra from "../../../infra";

const mailer = new bg.Mailer({
  SMTP_HOST: infra.Env.SMTP_HOST,
  SMTP_PORT: infra.Env.SMTP_PORT,
  SMTP_USER: infra.Env.SMTP_USER,
  SMTP_PASS: infra.Env.SMTP_PASS,
});

/** @public */
export class ArticlesToReviewNotifier {
  UTC_HOUR: bg.Schema.HourType = 7;

  numberOfArticlesToReview = 0;

  async build() {
    this.numberOfArticlesToReview = await infra.db.article.count({
      where: { status: "ready" },
    });

    return this;
  }

  private shouldBeSent() {
    if (this.numberOfArticlesToReview < 10) return false;

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
      to: infra.Env.ADMIN_USERNAME,
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
