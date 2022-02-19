import express from "express";
import render from "preact-render-to-string";
import serialize from "serialize-javascript";
import packageJson from "../package.json";

import * as VO from "../value-objects";
import * as Services from "../services";
import { ArticleRepository } from "../repositories/article-repository";
import { NewspaperRepository } from "../repositories/newspaper-repository";
import { StatsRepository } from "../repositories/stats-repository";
import { Settings } from "../aggregates/settings";

import { App } from "../frontend/app";

export async function Dashboard(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const settings = await new Settings().build();

  const state = {
    BUILD_DATE: Date.now(),
    BUILD_VERSION: `v${packageJson.version}`,
    archiveArticles: await ArticleRepository.getAll(),
    archiveNewspapers: await NewspaperRepository.getAll(),
    articles: await ArticleRepository.getAllNonProcessed(),
    favouriteArticles: await ArticleRepository.getFavourite(),
    newspapers: await NewspaperRepository.getAllNonArchived(),
    settings: {
      hours: VO.Hour.listFormatted(),
      articlesToReviewNotificationHour: VO.Hour.format(
        settings.articlesToReviewNotificationHour
      ),
      isArticlesToReviewNotificationEnabled:
        settings.isArticlesToReviewNotificationEnabled,
    },
    stats: await StatsRepository.getAll(),
  };

  const frontend = render(App({ ...state, url: request.url }));

  const html = Services.Html.process({
    content: frontend,
    state: serialize(state, { isJSON: true }),
  });

  return response.send(html);
}
