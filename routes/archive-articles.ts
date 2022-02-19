import express from "express";

import * as Repos from "../repositories";

export async function ArchiveArticles(
  _request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const articles = await Repos.ArticleRepository.getAll();

  return response.send(articles);
}
