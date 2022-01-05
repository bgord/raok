import express from "express";
import { ArticleRepository } from "../repositories/article-repository";

export async function Articles(
  _request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const articles = await ArticleRepository.getAllNonProcessed();

  return response.send(articles);
}
