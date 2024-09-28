import express from "express";

import * as VO from "../value-objects";
import * as Aggregates from "../aggregates";

/** @public */
export async function ArticleOpened(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction,
) {
  const id = VO.ArticleId.parse(request.params.articleId);

  const article = await Aggregates.Article.build(id);
  await article.opened();

  response.send();
}
