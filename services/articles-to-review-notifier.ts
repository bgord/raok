import { Mailer } from "@bgord/node";

import { ArticleRepository } from "../repositories/article-repository";
import { Env } from "../env";

const mailer = new Mailer({
  SMTP_HOST: Env.SMTP_HOST,
  SMTP_PORT: Env.SMTP_PORT,
  SMTP_USER: Env.SMTP_USER,
  SMTP_PASS: Env.SMTP_PASS,
});

export class ArticlesToReviewNotifier {
  UTC_HOUR = 8;

  numberOfArticlesToReview: number = 0;

  async build() {
    this.numberOfArticlesToReview =
      await ArticleRepository.getNumberOfNonProcessed();

    return this;
  }

  shouldBeSent() {
    if (this.numberOfArticlesToReview === 0) return false;

    const now = new Date();

    const hour = now.getUTCHours();
    const minute = now.getUTCMinutes();

    if (hour !== this.UTC_HOUR || minute !== 0) return false;

    return true;
  }

  async send() {
    return mailer.send({
      from: Env.SMTP_USER,
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
  }
}
