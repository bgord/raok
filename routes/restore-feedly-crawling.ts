import express from "express";

import * as Aggregates from "../aggregates";

export async function RestoreFeedlyCrawling(
  _request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const settings = await new Aggregates.Settings().build();
  await settings.restoreFeedlyCrawling();

  return response.redirect("/settings");
}
