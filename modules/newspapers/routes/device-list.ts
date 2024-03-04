import express from "express";

import * as Repos from "../repositories";

/** @public */
export async function DeviceList(
  _request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const devices = await Repos.DeviceRepository.list();

  return response.send(devices);
}
