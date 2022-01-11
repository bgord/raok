import express from "express";

import * as VO from "../value-objects";
import { Article } from "../aggregates/article";

export async function DeleteArticleFromFavourites(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const articleId = VO.ArticleId.parse(request.params.articleId);

  const article = await new Article(articleId).build();
  await article.deleteFromFavourites();

  return response.send();
}
