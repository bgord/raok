import express from "express";

import * as VO from "../value-objects";
import * as Aggregates from "../aggregates";

export async function UndeleteArticle(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const articleId = VO.ArticleId.parse(request.params.articleId);

  const article = await new Aggregates.Article(articleId).build();
  await article.undelete();

  return response.send();
}
