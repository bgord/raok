import express from "express";

import * as VO from "../value-objects";
import { Article } from "../aggregates/article";

export async function AddArticle(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  const articleUrl = VO.ArticleUrl.parse(request.body.url);

  await Article.add({ url: articleUrl });

  return response.redirect("/dashboard");
}
