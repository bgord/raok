import { z } from "zod";
import express from "express";

import * as VO from "../value-objects";
import * as Aggregates from "../aggregates";

export async function CreateNewspaper(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const articleIds = z.array(VO.ArticleId).parse(request.body.articleIds);

  const articles = [];

  for (const articleId of articleIds) {
    const article = await new Aggregates.Article(articleId).build();

    if (!article.entity) continue;
    articles.push(article);
  }

  await Aggregates.Newspaper.schedule(articles);

  return response.send();
}
