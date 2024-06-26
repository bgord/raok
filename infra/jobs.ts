import * as bg from "@bgord/node";
import {
  ToadScheduler,
  SimpleIntervalJob,
  CronJob,
  AsyncTask,
} from "toad-scheduler";

import * as RSS from "../modules/rss";
import * as Stats from "../modules/stats";
import { ExpiredSessionRemover } from "../app/services";
import { ArticlesToReviewNotifier } from "../modules/newspapers/services/articles-to-review-notifier";

import { logger } from "./logger";
import { Env } from "./env";

export const Scheduler = new ToadScheduler();

const ArticlesToReviewNotifierTask = new AsyncTask(
  "articles to review notifier",
  async () => {
    try {
      const notification = await new ArticlesToReviewNotifier().build();
      await notification.send();
    } catch (error) {
      console.error(error);
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

const WeeklyStatsReportNotificationTask = new AsyncTask(
  "weekly stats report notifier",
  async () => {
    const email = Env.ADMIN_USERNAME as bg.Schema.EmailToType;
    const range = new Stats.Services.WeeklyStatsRange();
    const stats = await Stats.Services.WeeklyStats.build(range);

    const notification =
      Stats.Services.WeeklyStatsReportNotificationComposer.compose(
        stats,
        range,
      );

    await notification.send(email);
  },
);

const WeeklyStatsReportNotificationJob = new CronJob(
  { cronExpression: `0 8 * * ${bg.UTC_DAY_OF_THE_WEEK.Monday}` },
  WeeklyStatsReportNotificationTask,
);

const SourceQualityUpdaterTask = new AsyncTask(
  "source quality updater",
  async () => {
    await RSS.Services.SourceQualityUpdater.update();
  },
);

const SourceQualityUpdaterTaskJob = new SimpleIntervalJob(
  { minutes: 15, runImmediately: true },
  SourceQualityUpdaterTask,
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
Scheduler.addCronJob(WeeklyStatsReportNotificationJob);
Scheduler.addSimpleIntervalJob(SourceQualityUpdaterTaskJob);
if (bg.FeatureFlag.isEnabled(Env.RSS_CRAWLING_ENABLED)) {
  Scheduler.addSimpleIntervalJob(RssCrawlerJob);
  Scheduler.addSimpleIntervalJob(RssCrawlJobProcessorJob);
}
