import express from "express";

import * as Events from "../events";

import { EventRepository } from "../repositories/event-repository";

export async function ScheduleFeedlyArticlesCrawl(
  _request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  await EventRepository.save(
    Events.FeedlyArticlesCrawlingScheduledEvent.parse({
      name: Events.FEEDLY_ARTICLES_CRAWLING_SCHEDULED_EVENT,
      version: 1,
      stream: "feedly-articles-crawl",
      payload: {},
    })
  );

  return response.send();
}
