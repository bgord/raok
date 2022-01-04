import express from "express";

import * as VO from "../value-objects";
import { Article } from "../aggregates/article";

export async function DeleteArticle(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  const articleId = VO.ArticleId.parse(request.params.articleId);

  const article = await new Article(articleId).build();
  await article.delete();

  return response.redirect("/dashboard");
}
