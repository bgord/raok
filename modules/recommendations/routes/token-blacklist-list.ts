import express from "express";

import * as Repos from "../repositories";

export async function TokenBlacklistList(
  _request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const tokens = await Repos.TokenBlacklistRepository.list();

  return response.status(200).send(tokens);
}
