import express from "express";

import * as VO from "../value-objects";
import { Settings as _Settings } from "../aggregates/settings";

export async function Settings(
  _request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const settings = await new _Settings().build();

  return response.send({
    hours: VO.Hour.listFormatted(),
    articlesToReviewNotificationHour: VO.Hour.format(
      settings.articlesToReviewNotificationHour
    ),
    isArticlesToReviewNotificationEnabled:
      settings.isArticlesToReviewNotificationEnabled,
  });
}
