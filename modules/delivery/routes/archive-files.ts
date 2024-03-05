import express from "express";

import * as Repos from "../repositories";

/** @public */
export async function ArchiveFiles(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction,
) {
  const filters = Repos.ArchiveFilesFilter.parse(request.query);
  const files = await Repos.FilesRepository.getAll(filters);

  return response.send(files);
}
