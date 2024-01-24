import * as bg from "@bgord/node";
import express from "express";

import * as VO from "../value-objects";
import * as Aggregates from "../aggregates";

/** @public */
export async function UndeleteArticle(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction,
) {
  const revision = bg.Revision.fromWeakETag(request.WeakETag);
  const id = VO.ArticleId.parse(request.params.articleId);

  const article = await Aggregates.Article.build(id);
  await article.undelete(revision);

  return response.send();
}
