import express from "express";

import * as Repos from "../repositories";

export async function Settings(
  _request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const settings = await Repos.SettingsRepository.getAll();

  return response.send(settings);
}
