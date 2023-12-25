import * as bg from "@bgord/node";
import express from "express";

import * as Repos from "../repositories";

import * as infra from "../../../infra";

export async function TokenBlacklist(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const tokens = await Repos.TokenBlacklistRepository.list();

  infra.ResponseCache.set(request.url, tokens, bg.Time.Minutes(30).seconds);
  return response.status(200).send(tokens);
}
