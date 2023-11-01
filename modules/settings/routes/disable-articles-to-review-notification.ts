import express from "express";

import * as Aggregates from "../aggregates";

export async function DisableArticlesToReviewNotification(
  _request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  const settings = await new Aggregates.Settings().build();

  await settings.disableArticlesToReviewNotification();

  return response.redirect("/settings");
}
