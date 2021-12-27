import express from "express";
import { CsrfShield } from "@bgord/node";

import { Settings } from "../aggregates/settings";

export async function Dashboard(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  const settings = await new Settings().build();

  const vars = {
    username: request.user,
    ...settings,
    ...CsrfShield.extract(request),
  };

  return response.render("dashboard", vars);
}
