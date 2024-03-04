import express from "express";

import * as Repos from "../repositories";
import * as VO from "../value-objects";

/** @public */
export async function DeviceDelete(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const id = VO.DeviceId.parse(request.params.id);

  // TODO: Add at least one device check
  await Repos.DeviceRepository.delete(id);

  return response.send(201);
}
