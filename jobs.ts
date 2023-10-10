import { ToadScheduler, SimpleIntervalJob, AsyncTask } from "toad-scheduler";

import * as Services from "./services";
import * as Events from "./events";
import * as VO from "./value-objects";
import * as Repos from "./repositories";
import * as Aggregates from "./aggregates";
import * as infra from "./infra";

export const Scheduler = new ToadScheduler();

const FeedlyArticlesCrawlerTask = new AsyncTask(
  "feedly articles crawler",
  async () =>
    Repos.EventRepository.save(
      Events.FeedlyArticlesCrawlingScheduledEvent.parse({
        name: Events.FEEDLY_ARTICLES_CRAWLING_SCHEDULED_EVENT,
        version: 1,
        stream: "feedly-articles-crawl",
        payload: {},
      })
    )
);

const ArticlesToReviewNotifierTask = new AsyncTask(
  "articles to review notifier",
  async () => {
    try {
      const settings = await new Aggregates.Settings().build();

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

const FeedlyArticlesCrawlerJob = new SimpleIntervalJob(
  { hours: VO.FEEDLY_CRAWLING_INTERVAL_HOURS, runImmediately: false },
  FeedlyArticlesCrawlerTask
);

const ArticlesToReviewNotifierJob = new SimpleIntervalJob(
  { minutes: 1, runImmediately: true },
  ArticlesToReviewNotifierTask
);

Scheduler.addSimpleIntervalJob(FeedlyArticlesCrawlerJob);
Scheduler.addSimpleIntervalJob(ArticlesToReviewNotifierJob);
