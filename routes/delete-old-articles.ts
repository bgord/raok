import express from "express";
import { Time } from "@bgord/node";

import * as Aggregates from "../aggregates";
import * as Events from "../events";
import * as Repos from "../repositories";

export async function DeleteOldArticles(
  _request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const now = Date.now();

  await Repos.EventRepository.save(
    Events.DeleteOldArticlesEvent.parse({
      name: Events.DELETE_OLD_ARTICLES_EVENT,
      stream: String(now),
      version: 1,
      payload: {
        marker:
          now - Time.Days(Aggregates.Article.ARTICLE_OLD_MARKER_IN_DAYS).toMs(),
      },
    })
  );
  return response.send();
}
