import express from "express";

import { ArticleRepository } from "../repositories/article-repository";

export async function ArchiveArticles(
  _request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const articles = await ArticleRepository.getAll();

  return response.send(articles);
}
