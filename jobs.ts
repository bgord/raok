import { Reporter } from "@bgord/node";
import { ToadScheduler, SimpleIntervalJob, AsyncTask } from "toad-scheduler";

import * as Services from "./services";
import * as Events from "./events";

import { EventRepository } from "./repositories/event-repository";
import { Settings } from "./aggregates/settings";

export const Scheduler = new ToadScheduler();

const FeedlyArticlesCrawlerTask = new AsyncTask(
  "feedly articles crawler",
  async () =>
    EventRepository.save(
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
    const settings = await new Settings().build();

    const notification = await new Services.ArticlesToReviewNotifier(
      settings
    ).build();

    if (notification.shouldBeSent()) {
      try {
        await notification.send();
        Reporter.success("Articles to review notification sent");
      } catch (error) {
        Reporter.raw("ArtclesToReviewNotifierTask", error);
      }
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
