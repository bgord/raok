import express from "express";

import { Article } from "../aggregates/article";

export async function AddArticle(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  await Article.add({ url: request.body.url });

  return response.redirect("/dashboard");
}
