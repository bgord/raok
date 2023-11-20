import * as bg from "@bgord/node";
import express from "express";

import * as VO from "../value-objects";
import * as Aggregates from "../aggregates";

export async function CancelNewspaper(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const revision = bg.Revision.fromWeakETag(request.WeakETag);
  const newspaperId = VO.Newspaper._def
    .shape()
    .id.parse(request.params.newspaperId);

  const newspaper = await new Aggregates.Newspaper(newspaperId).build();
  await newspaper.cancel(revision);

  return response.send();
}
