import express from "express";

import * as VO from "../value-objects";
import { NewspaperRepository } from "../repositories/newspaper-repository";

export async function SingleNewspaper(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const newspaperId = VO.NewspaperId.parse(request.params.newspaperId);

  const newspaper = await NewspaperRepository.getById(newspaperId);

  return response.send(newspaper);
}
