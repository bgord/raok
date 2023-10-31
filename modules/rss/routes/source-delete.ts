import express from "express";

import * as VO from "../value-objects";
import * as Repos from "../repositories";

export async function SourceDelete(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const id = VO.SourceId.parse(request.params.sourceId);

  await Repos.SourceRepository.delete({ id });

  return response.status(200).send();
}
