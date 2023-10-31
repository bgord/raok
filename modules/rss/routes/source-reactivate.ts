import express from "express";

import * as VO from "../value-objects";
import * as Services from "../services";

export async function SourceReactivate(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const id = VO.SourceId.parse(request.params.sourceId);

  const source = await Services.Source.build(id);
  await source.reactivate();

  return response.status(200).send();
}
