import express from "express";

import { SettingsRepository } from "../repositories/settings-repository";

export async function Settings(
  _request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const settings = await SettingsRepository.getAll();

  return response.send(settings);
}
