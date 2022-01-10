import express from "express";
import { ArticleRepository } from "../repositories/article-repository";

export async function FavouriteArticles(
  _request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const favouriteArticles = await ArticleRepository.getFavourite();

  return response.send(favouriteArticles);
}
