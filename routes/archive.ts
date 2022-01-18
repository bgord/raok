import express from "express";

import { ArticleRepository } from "../repositories/article-repository";

export async function Archive(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  const articles = await ArticleRepository.getAll();

  const vars = {
    username: request.user as string,
    articles,
  };

  return response.render("archive", vars);
}
