import express from "express";

import * as Repos from "../repositories";

export async function SourceList(
  _request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const sources = await Repos.SourceRepository.listAll();

  return response.status(200).send(sources);
}
