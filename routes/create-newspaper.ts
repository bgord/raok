import { z } from "zod";
import _ from "lodash";
import express from "express";

import * as VO from "../value-objects";
import { Newspaper } from "../aggregates/newspaper";
import { Article } from "../aggregates/article";

export async function CreateNewspaper(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  const articleIds = z
    .array(VO.Article._def.shape().id)
    .parse(request.body.articleIds);

  const articles = [];

  for (const articleId of articleIds) {
    const article = await new Article(articleId).build();

    if (!article.entity) continue;
    articles.push(article.entity);
  }

  await Newspaper.schedule(articles);

  return response.redirect("/dashboard");
}
