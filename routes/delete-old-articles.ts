import express from "express";

import { Article } from "../aggregates/article";
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
      payload: { now, marker: Article.OLD_ARTICLE_MARKER_MS },
    })
  );
  return response.send();
}
