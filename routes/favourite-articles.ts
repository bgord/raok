import express from "express";

import * as Repos from "../repositories";

export async function FavouriteArticles(
  _request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const favouriteArticles = await Repos.ArticleRepository.getFavourite();

  return response.send(favouriteArticles);
}
