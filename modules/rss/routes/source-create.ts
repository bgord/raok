import * as bg from "@bgord/node";
import express from "express";

import * as VO from "../value-objects";
import * as Services from "../services";

export async function SourceCreate(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const id = VO.SourceId.parse(bg.NewUUID.generate());
  const url = VO.SourceUrl.parse(request.body.url);

  await Services.Source.create({ id, url });

  return response.status(201).send();
}
