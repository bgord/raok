import * as bg from "@bgord/node";
import express from "express";

import * as Aggregates from "../aggregates";
import * as Events from "../events";

import * as infra from "../../../infra";

export async function DeleteOldArticles(
  _request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const now = Date.now();

  await infra.EventStore.save(
    Events.DeleteOldArticlesEvent.parse({
      name: Events.DELETE_OLD_ARTICLES_EVENT,
      stream: String(now),
      version: 1,
      payload: {
        marker:
          now - bg.Time.Days(Aggregates.Article.ARTICLE_OLD_MARKER_IN_DAYS).ms,
      },
    })
  );
  return response.send();
}
