import express from "express";

import * as Repos from "../repositories";

export async function Stats(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const stats = await Repos.StatsRepository.getAll();

  return response.send(stats);
}
