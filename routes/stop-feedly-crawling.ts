import express from "express";

import { Settings } from "../aggregates/settings";

export async function StopFeedlyCrawling(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const settings = await new Settings().build();
  await settings.stopFeedlyCrawling();

  return response.redirect("/settings");
}
