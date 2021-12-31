import express from "express";
import { CsrfShield } from "@bgord/node";

import { NewspaperRepository } from "../repositories/newspaper-repository";
import { ArticleRepository } from "../repositories/article-repository";

export async function Dashboard(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  const newspapers = await NewspaperRepository.getAll();
  const articles = await ArticleRepository.getAllNonProcessed();

  console.log(newspapers);

  const vars = {
    username: request.user,
    articles,
    newspapers,
    ...CsrfShield.extract(request),
  };

  return response.render("dashboard", vars);
}
