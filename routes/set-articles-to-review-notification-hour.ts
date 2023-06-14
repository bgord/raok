import * as bg from "@bgord/node";
import express from "express";

import * as Aggregates from "../aggregates";

export async function SetArticlesToReviewNotificationHour(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  const utcHour = bg.Schema.Hour.parse(Number(request.body.hour));

  const settings = await new Aggregates.Settings().build();
  await settings.setArticlesToReviewNotificationHour(utcHour);

  return response.redirect("/settings");
}
