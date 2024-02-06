import express from "express";

import * as VO from "../value-objects";
import * as Aggregates from "../aggregates";

/** @public */
export async function ArticleHomepageOpened(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction,
) {
  const id = VO.ArticleId.parse(request.params.articleId);

  const article = await Aggregates.Article.build(id);
  await article.homepageOpened();

  return response.send();
}
