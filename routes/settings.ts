import express from "express";

import * as VO from "../value-objects";
import { Settings as _Settings } from "../aggregates/settings";

export async function Settings(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  const settings = await new _Settings().build();

  const hours = VO.Hour.listFormatted().map((hour) => ({
    selected: hour.value === settings.articlesToReviewNotificationHour,
    ...hour,
  }));

  const vars = {
    username: request.user as string,
    hours,
    isArticlesToReviewNotificationEnabled:
      settings.isArticlesToReviewNotificationEnabled,
    isArticlesToReviewNotificationDisabled:
      !settings.isArticlesToReviewNotificationEnabled,
    articlesToReviewNotificationHour: VO.Hour.format(
      settings.articlesToReviewNotificationHour
    ),
  };

  return response.render("settings", vars);
}
