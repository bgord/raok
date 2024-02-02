import * as bg from "@bgord/node";
import { ToadScheduler, SimpleIntervalJob, AsyncTask } from "toad-scheduler";

import { ExpiredSessionRemover } from "../app/services";
import * as RSS from "../modules/rss";
import * as Settings from "../modules/settings";
import * as Newspapers from "../modules/newspapers";

import { logger } from "./logger";
import { Env } from "./env";

export const Scheduler = new ToadScheduler();

const ArticlesToReviewNotifierTask = new AsyncTask(
  "articles to review notifier",
  async () => {
    try {
      const settings = await new Settings.Aggregates.Settings().build();

      const notification =
        await new Newspapers.Services.ArticlesToReviewNotifier(
          settings,
        ).build();
      await notification.send();
    } catch (error) {
      logger.error({
        message: "ArticlesToReviewNotifierTask error",
        operation: "articles_to_review_notifier_task_error",
        metadata: { error: JSON.stringify(error) },
      });
    }
  },
);

const ArticlesToReviewNotifierJob = new SimpleIntervalJob(
  { minutes: 1, runImmediately: true },
  ArticlesToReviewNotifierTask,
);

const RssCrawlerTask = new AsyncTask("rss-crawler", async () => {
  try {
    await RSS.Services.RSSCrawler.crawl();
  } catch (error) {
    logger.error({
      message: "RssCrawlerTask error",
      operation: "rss_crawler_error",
      metadata: { error: logger.formatError(error) },
    });
  }
});

const RssCrawlerJob = new SimpleIntervalJob(
  { minutes: RSS.Services.RSSCrawler.INTERVAL_MINUTES, runImmediately: true },
  RssCrawlerTask,
);

const RssCrawlJobProcessorTask = new AsyncTask(
  "rss-crawl-job-processor",
  async () => {
    try {
      await RSS.Services.RssCrawlerJobProcessor.process();
    } catch (error) {
      logger.error({
        message: "RssCrawlJobProcessorTask error",
        operation: "rss_crawl_job_processor_error",
        metadata: { error: logger.formatError(error) },
      });
    }
  },
);

const RssCrawlJobProcessorJob = new SimpleIntervalJob(
  {
    minutes: RSS.Services.RssCrawlerJobProcessor.INTERVAL_MINUTES,
    runImmediately: true,
  },
  RssCrawlJobProcessorTask,
);

const ExpiredSessionRemoverTask = new AsyncTask(
  "expired-session-remover",
  async () => {
    await ExpiredSessionRemover.process();
  },
);

const ExpiredSessionRemoverTaskJob = new SimpleIntervalJob(
  { minutes: 1, runImmediately: true },
  ExpiredSessionRemoverTask,
);

Scheduler.addSimpleIntervalJob(ArticlesToReviewNotifierJob);
Scheduler.addSimpleIntervalJob(ExpiredSessionRemoverTaskJob);
if (bg.FeatureFlag.isEnabled(Env.RSS_CRAWLING_ENABLED)) {
  Scheduler.addSimpleIntervalJob(RssCrawlerJob);
  Scheduler.addSimpleIntervalJob(RssCrawlJobProcessorJob);
}
