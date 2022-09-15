import express from "express";

import * as Aggregates from "../aggregates";
import * as Events from "../events";
import * as Repos from "../repositories";

export async function DeleteAllArticles(
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
      payload: { marker: now },
    })
  );
  return response.send();
}
