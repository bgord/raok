import express from "express";

import { NewspaperRepository } from "../repositories/newspaper-repository";

export async function ArchiveNewspapers(
  _request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const newspapers = await NewspaperRepository.getAll();

  return response.send(newspapers);
}
