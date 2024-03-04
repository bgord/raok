import express from "express";

import * as Services from "../services";

/** @public */
export async function DeviceList(
  _request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const deviceManager = await Services.DeviceManager.build();
  const devices = deviceManager.list();

  return response.send(devices);
}
