import { z } from "zod";
import _ from "lodash";
import express from "express";

import * as VO from "../value-objects";
import { Articles } from "../aggregates/articles";
import { TableOfContents } from "../aggregates/table-of-contents";

export async function CreateNewspaper(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  const articleIds = z
    .array(VO.Article._def.shape().id)
    .parse(request.body.articleIds);

  const articles = await new Articles().build();

  const contents = articleIds
    .map(articles.getById)
    .map((article) => _.pick(article, "id", "url"));

  const toc = new TableOfContents(contents);

  await toc.scheduleNewspaper();

  return response.redirect("/dashboard");
}
