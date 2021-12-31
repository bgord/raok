import express from "express";
import { CsrfShield } from "@bgord/node";

import { NewspaperRepository } from "../repositories/newspaper-repository";
import { ArticleRepository } from "../repositories/article-repository";

import { Settings } from "../aggregates/settings";

export async function Dashboard(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  const newspapers = await NewspaperRepository.getAll();
  const articles = await ArticleRepository.getAll();

  const settings = await new Settings().build();

  const vars = {
    username: request.user,
    articles,
    newspapers,
    ...settings,
    ...CsrfShield.extract(request),
  };

  return response.render("dashboard", vars);
}
