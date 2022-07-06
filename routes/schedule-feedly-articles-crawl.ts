import express from "express";

import * as Events from "../events";
import * as Repos from "../repositories";
import * as Policies from "../policies";
import { Settings } from "../aggregates/settings";

export async function ScheduleFeedlyArticlesCrawl(
  _request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const settings = await new Settings().build();

  await Policies.ShouldCrawlFeedly.perform({ settings });

  await Repos.EventRepository.save(
    Events.FeedlyArticlesCrawlingScheduledEvent.parse({
      name: Events.FEEDLY_ARTICLES_CRAWLING_SCHEDULED_EVENT,
      version: 1,
      stream: "feedly-articles-crawl",
      payload: {},
    })
  );

  return response.send();
}
