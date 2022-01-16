import express from "express";

import * as VO from "../value-objects";
import { Settings as _Settings } from "../aggregates/settings";

export async function Settings(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  const settings = await new _Settings().build();

  const vars = {
    username: request.user as string,
    hours: VO.Hour.listFormatted(),
    ...settings,
  };

  return response.render("settings", vars);
}
