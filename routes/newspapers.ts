import express from "express";

import * as VO from "../value-objects";
import { NewspaperRepository } from "../repositories/newspaper-repository";

export async function Newspapers(
  _request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const newspapers = await NewspaperRepository.getAll();

  const nonArchivedNewspapers = newspapers.filter(
    (newspaper) => newspaper.status !== VO.NewspaperStatusEnum.archived
  );

  return response.send(nonArchivedNewspapers);
}
