import express from "express";

import { Articles } from "../aggregates/articles";

export async function DeleteArticle(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  const articles = await new Articles().build();
  await articles.deleteArticle({ articleId: request.params.articleId });

  return response.redirect("/dashboard");
}
