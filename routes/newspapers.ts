import express from "express";

import { NewspaperRepository } from "../repositories/newspaper-repository";

export async function Newspapers(
  _request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const newspapers = await NewspaperRepository.getAllNonArchived();

  return response.send(newspapers);
}
