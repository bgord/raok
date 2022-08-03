import express from "express";

import * as Aggregates from "../aggregates";

export async function EnableArticlesToReviewNotification(
  _request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  const settings = await new Aggregates.Settings().build();

  await settings.enableArticlesToReviewNotification();

  return response.redirect("/settings");
}
