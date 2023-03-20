import express from "express";
import * as Repos from "../repositories";
import * as VO from "../value-objects";

export async function ArticlesSearch(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const query = VO.ArticleSearchQuery.parse(request.query.query);
  const articles = await Repos.ArticleRepository.search(query);

  return response.send(articles);
}
