import express from "express";

import * as Repos from "../repositories";

export async function Newspapers(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const newspapers = await Repos.NewspaperRepository.getAllNonArchived(
    request.timeZoneOffset.miliseconds
  );

  return response.send(newspapers);
}
