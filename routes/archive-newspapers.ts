import express from "express";

import * as Repos from "../repositories";

export async function ArchiveNewspapers(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const filters = Repos.ArchiveNewspaperFilter.parse(request.query);
  const newspapers = await Repos.NewspaperRepository.getAll(filters);

  return response.send(newspapers);
}
