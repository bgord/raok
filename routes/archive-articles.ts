import * as z from "zod";
import express from "express";

import * as Repos from "../repositories";
import * as VO from "../value-objects";
import * as Services from "../services";

export async function ArchiveArticles(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const filters = Services.Filter.parse({
    schema: z.object({
      status: VO.ArticleStatus.optional(),
      source: VO.ArticleSource.optional(),
    }),
    values: request.query,
  });

  const articles = await Repos.ArticleRepository.getAll(filters);

  return response.send(articles);
}
