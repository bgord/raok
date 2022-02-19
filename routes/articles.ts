import express from "express";

import * as Repos from "../repositories";

export async function Articles(
  _request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const articles = await Repos.ArticleRepository.getAllNonProcessed();

  return response.send(articles);
}
