import express from "express";

import * as VO from "../value-objects";
import { Settings } from "../aggregates/settings";

export async function UpdateNumberOfArticlesToAutosend(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  const numberOfArticlesToAutosend = VO.NumberOfArticlesToAutosend.parse(
    Number(request.body.numberOfArticlesToAutosend)
  );

  const settings = await new Settings().build();
  await settings.updateNumberOfArticlesToAutosend(numberOfArticlesToAutosend);

  return response.redirect("/dashboard");
}
