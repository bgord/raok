import express from "express";
import { CsrfShield } from "@bgord/node";

import { StatsRepository } from "../repositories/stats-repository";

export async function Dashboard(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  const stats = await StatsRepository.getAll();

  const vars = {
    username: request.user,
    stats,
    ...CsrfShield.extract(request),
  };

  return response.render("dashboard", vars);
}
