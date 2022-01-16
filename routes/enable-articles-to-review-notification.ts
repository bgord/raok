import express from "express";

import { Settings } from "../aggregates/settings";

export async function EnableArticlesToReviewNotification(
  _request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  const settings = await new Settings().build();

  await settings.enableArticlesToReviewNotification();

  return response.redirect("/settings");
}
