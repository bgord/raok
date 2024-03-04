import * as bg from "@bgord/node";
import express from "express";

import * as Repos from "../repositories";
import * as VO from "../value-objects";

/** @public */
export async function DeviceCreate(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const id = bg.NewUUID.generate();
  const name = VO.DeviceName.parse(request.body.name);
  const email = VO.DeviceEmail.parse(request.body.email);

  // TODO: Add a unique check
  await Repos.DeviceRepository.create({ id, email, name });

  return response.send(201);
}
