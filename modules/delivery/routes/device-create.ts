import * as bg from "@bgord/node";
import express from "express";

import * as Services from "../services";
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
  const createdAt = BigInt(Date.now());

  const deviceManager = await Services.DeviceManager.build();

  const device = new Services.Device({ id, name, email, createdAt });
  await deviceManager.add(device);

  response.sendStatus(201);
}
