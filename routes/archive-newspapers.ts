import express from "express";

import * as Repos from "../repositories";

export async function ArchiveNewspapers(
  _request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const newspapers = await Repos.NewspaperRepository.getAll();

  return response.send(newspapers);
}
