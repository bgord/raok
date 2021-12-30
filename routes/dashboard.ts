import express from "express";
import { CsrfShield } from "@bgord/node";

import { NewspaperRepository } from "../repositories/newspaper-repository";

import { Settings } from "../aggregates/settings";
import { Articles } from "../aggregates/articles";

export async function Dashboard(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  const newspapers = await NewspaperRepository.getAll();

  const settings = await new Settings().build();
  const articles = (await new Articles().build()).articles;

  const vars = {
    username: request.user,
    articles,
    newspapers,
    ...settings,
    ...CsrfShield.extract(request),
  };

  return response.render("dashboard", vars);
}
