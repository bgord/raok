import express from "express";
import * as bg from "@bgord/node";

import * as Events from "../../../app/events";
import { Device } from "../../newspapers/services/device-manager";
import {
  ArbitraryFileScheduledEvent,
  ARBITRARY_FILE_SCHEDULED_EVENT,
} from "../events";

/** @public */
export async function SendArbitraryFile(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const file = bg.Schema.UploadedFile.parse(request.body?.file);
  const deviceId = request.body.deviceId;

  const device = await Device.build(deviceId);

  Events.emittery.emit(
    ARBITRARY_FILE_SCHEDULED_EVENT,
    ArbitraryFileScheduledEvent.parse({
      stream: file.path,
      name: ARBITRARY_FILE_SCHEDULED_EVENT,
      version: 1,
      payload: { ...file, email: device.specification.email },
    })
  );

  return response.send();
}
