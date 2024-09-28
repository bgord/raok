import * as bg from "@bgord/node";
import express from "express";

import * as VO from "../value-objects";
import * as Repos from "../repositories";

/** @public */
export async function ArchiveArticles(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction,
) {
  const search = VO.ArticleArchiveSearchQuery.parse(request.query.search);
  const pagination = bg.Pagination.parse(request.query, VO.ARTICLES_PER_PAGE);
  const filters = Repos.ArchiveArticlesFilter.parse(request.query);

  const articles = await Repos.ArticleRepository.pagedGetAll(
    pagination,
    search,
    filters,
  );

  response.send(articles);
}
