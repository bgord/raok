import express from "express";

import { Article } from "../aggregates/article";

export async function DeleteArticle(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  const article = await new Article(request.params.articleId).build();
  await article.delete();

  return response.redirect("/dashboard");
}
