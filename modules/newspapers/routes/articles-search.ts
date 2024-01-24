import express from "express";
import * as Repos from "../repositories";
import * as VO from "../value-objects";

/** @public */
export async function ArticlesSearch(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction,
) {
  const query = VO.ArticleSearchQuery.parse(request.query.query);
  const articles = await Repos.ArticleRepository.search(query);

  if (articles.length === 0) {
    return response
      .status(404)
      .send({ message: "article.search.empty", _known: true });
  }

  return response.send(articles);
}
