import * as bg from "@bgord/node";
import express from "express";

import * as Repos from "../repositories";

import * as infra from "../../../infra";

export async function SourceList(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction,
) {
  const sources = await Repos.SourceRepository.listAll();

  infra.ResponseCache.set(request.url, sources, bg.Time.Minutes(5).seconds);
  response.status(200).send(sources);
}
