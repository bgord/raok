import express from "express";

import * as Repos from "../repositories";

/** @public */
export async function Newspapers(
  _request: express.Request,
  response: express.Response,
  _next: express.NextFunction,
) {
  const newspapers = await Repos.NewspaperRepository.getAllNonArchived();

  response.send(newspapers);
}
