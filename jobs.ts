import { ToadScheduler, SimpleIntervalJob, AsyncTask } from "toad-scheduler";

import * as RSS from "./modules/rss";
import * as Settings from "./modules/settings";

import * as Services from "./services";
import * as infra from "./infra";

export const Scheduler = new ToadScheduler();

const ArticlesToReviewNotifierTask = new AsyncTask(
  "articles to review notifier",
  async () => {
    try {
      const settings = await new Settings.Aggregates.Settings().build();

      const notification = await new Services.ArticlesToReviewNotifier(
        settings
      ).build();
      await notification.send();
    } catch (error) {
      infra.logger.error({
        message: "ArticlesToReviewNotifierTask error",
        operation: "articles_to_review_notifier_task_error",
        metadata: { error: JSON.stringify(error) },
      });
    }
  }
);

const ArticlesToReviewNotifierJob = new SimpleIntervalJob(
  { minutes: 1, runImmediately: true },
  ArticlesToReviewNotifierTask
);

const RssCrawlerTask = new AsyncTask("rss-crawler", async () => {
  try {
    const rssCrawler = new RSS.Services.RSSCrawler();
    await rssCrawler.crawl();
    await rssCrawler.process();
  } catch (error) {
    infra.logger.error({
      message: "RssCrawlerTask error",
      operation: "rss_crawler_error",
      metadata: { error: infra.logger.formatError(error) },
    });
  }
});

const RssCrawlerJob = new SimpleIntervalJob(
  { minutes: RSS.Services.RSSCrawler.INTERVAL_MINUTES, runImmediately: true },
  RssCrawlerTask
);

Scheduler.addSimpleIntervalJob(ArticlesToReviewNotifierJob);

if (infra.Env.RSS_CRAWLING_ENABLED === "yes") {
  Scheduler.addSimpleIntervalJob(RssCrawlerJob);
}
