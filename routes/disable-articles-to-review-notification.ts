import express from "express";

import { Settings } from "../aggregates/settings";

export async function DisableArticlesToReviewNotification(
  _request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  const settings = await new Settings().build();

  await settings.disableArticlesToReviewNotification();

  return response.redirect("/settings");
}
