import express from "express";

import * as Repos from "../repositories";

export async function ArchiveArticles(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const filters = Repos.ArchiveArticlesFilter.parse(request.query);
  const articles = await Repos.ArticleRepository.getAll(filters);

  return response.send(articles);
}
