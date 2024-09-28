import express from "express";

import * as VO from "../value-objects";
import * as Aggregates from "../aggregates";

/** @public */
export async function AddArticle(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction,
) {
  const url = VO.ArticleUrl.parse(request.body.url);

  await Aggregates.Article.add({ url, source: VO.ArticleSourceEnum.web });

  response.send();
}
