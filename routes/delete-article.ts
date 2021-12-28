import express from "express";

import { Articles } from "../aggregates/articles";

export async function DeleteArticle(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  await Articles.deleteArticle({ articleId: request.params.articleId });

  return response.redirect("/dashboard");
}
