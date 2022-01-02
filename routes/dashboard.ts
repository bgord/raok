import express from "express";
import { CsrfShield } from "@bgord/node";

import * as VO from "../value-objects";
import { NewspaperRepository } from "../repositories/newspaper-repository";
import { ArticleRepository } from "../repositories/article-repository";

export async function Dashboard(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
): Promise<void> {
  const newspapers = await NewspaperRepository.getAll();
  const articles = await ArticleRepository.getAllNonProcessed();

  const vars = {
    username: request.user,
    articles,
    newspapers: newspapers
      .filter(
        (newspaper) => newspaper.status !== VO.NewspaperStatusEnum.archived
      )
      .map((newspaper) => ({
        ...newspaper,
        hasFailed: newspaper.status === VO.NewspaperStatusEnum.error,
        hasBeenDelivered: newspaper.status === VO.NewspaperStatusEnum.delivered,
      })),
    ...CsrfShield.extract(request),
  };

  return response.render("dashboard", vars);
}
