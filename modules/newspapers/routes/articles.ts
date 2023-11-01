import express from "express";
import * as bg from "@bgord/node";

import * as VO from "../value-objects";
import * as Repos from "../repositories";

export async function Articles(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const pagination = bg.Pagination.parse(request.query, VO.ARTICLES_PER_PAGE);
  const articles = await Repos.ArticleRepository.pagedGetAllNonProcessed(
    pagination
  );

  return response.send(articles);
}
