import { z } from "zod";
import _ from "lodash";
import express from "express";

import * as VO from "../value-objects";
import { Article } from "../aggregates/article";
import { TableOfContents } from "../aggregates/table-of-contents";

export async function CreateNewspaper(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  const articleIds = z
    .array(VO.Article._def.shape().id)
    .parse(request.body.articleIds);

  const contents = [];

  for (const articleId of articleIds) {
    const article = await new Article(articleId).build();

    if (!article.entity) continue;
    contents.push(article.entity);
  }

  const toc = new TableOfContents(contents);
  await toc.scheduleNewspaper();

  return response.redirect("/dashboard");
}
