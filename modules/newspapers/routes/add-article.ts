import express from "express";

import * as VO from "../value-objects";
import * as Aggregates from "../aggregates";

export async function AddArticle(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const articleUrl = VO.ArticleUrl.parse(request.body.url);

  await Aggregates.Article.add({ url: articleUrl });

  return response.send();
}
