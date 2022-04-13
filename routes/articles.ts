import express from "express";
import * as bg from "@bgord/node";

import * as Repos from "../repositories";

export async function Articles(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const pagination = bg.Pagination.parse(request.query);
  const articles = await Repos.ArticleRepository.pagedGetAllNonProcessed(
    pagination
  );

  return response.send(articles);
}
