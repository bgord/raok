import express from "express";
import { StatsRepository } from "../repositories/stats-repository";

export async function Stats(
  _request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const stats = await StatsRepository.getAll();

  return response.send(stats);
}
