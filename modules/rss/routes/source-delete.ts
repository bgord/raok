import * as bg from "@bgord/node";
import express from "express";

import * as Reordering from "../../reordering";

import * as VO from "../value-objects";
import * as Services from "../services";

export async function SourceDelete(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const revision = bg.Revision.fromWeakETag(request.WeakETag);
  const id = VO.SourceId.parse(request.params.sourceId);

  const source = await Services.Source.build(id);
  await source.delete(revision);
  await Reordering.Services.Reordering.delete({ correlationId: "sources", id });

  return response.status(200).send();
}
