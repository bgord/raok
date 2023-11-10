import * as bg from "@bgord/node";
import express from "express";

import * as Reordering from "../../reordering";

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
  await Reordering.Services.Reordering.add({ correlationId: "sources", id });

  return response.status(201).send();
}
