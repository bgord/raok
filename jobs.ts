import { Reporter } from "@bgord/node";
import { ToadScheduler, SimpleIntervalJob, AsyncTask } from "toad-scheduler";

import * as Services from "./services";
import * as Events from "./events";
import * as VO from "./value-objects";
import * as Repos from "./repositories";
import * as Aggregates from "./aggregates";

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

const ArtclesToReviewNotifierTask = new AsyncTask(
  "artcles to review notifier",
  async () => {
    const settings = await new Aggregates.Settings().build();

    const notification = await new Services.ArticlesToReviewNotifier(
      settings
    ).build();

    try {
      await notification.send();
    } catch (error) {
      Reporter.raw("ArtclesToReviewNotifierTask", error);
    }
  }
);

const FeedlyArticlesCrawlerJob = new SimpleIntervalJob(
  { hours: VO.FEEDLY_CRAWLING_INTERVAL_HOURS, runImmediately: false },
  FeedlyArticlesCrawlerTask
);

const ArtclesToReviewNotifierJob = new SimpleIntervalJob(
  { minutes: 1, runImmediately: true },
  ArtclesToReviewNotifierTask
);

Scheduler.addSimpleIntervalJob(FeedlyArticlesCrawlerJob);
Scheduler.addSimpleIntervalJob(ArtclesToReviewNotifierJob);
