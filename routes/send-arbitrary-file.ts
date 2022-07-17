import express from "express";
import * as bg from "@bgord/node";

import * as Events from "../events";

export async function SendArbitraryFile(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const file = bg.Schema.UploadedFile.parse(request.body?.file);

  Events.emittery.emit(
    Events.ARBITRARY_FILE_SCHEDULED_EVENT,
    Events.ArbitraryFileScheduledEvent.parse({
      stream: file.path,
      name: Events.ARBITRARY_FILE_SCHEDULED_EVENT,
      version: 1,
      payload: file,
    })
  );

  return response.send();
}
