import express from "express";

import * as Services from "../services";
import * as VO from "../value-objects";

/** @public */
export async function DeviceDelete(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const id = VO.DeviceId.parse(request.params.id);

  const deviceManager = await Services.DeviceManager.build();
  const device = await Services.Device.build(id);
  await deviceManager.delete(device);

  return response.send(201);
}
