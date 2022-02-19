import express from "express";
import render from "preact-render-to-string";
import serialize from "serialize-javascript";

import * as Services from "../services";
import { ArticleRepository } from "../repositories/article-repository";
import { NewspaperRepository } from "../repositories/newspaper-repository";
import { StatsRepository } from "../repositories/stats-repository";
import { SettingsRepository } from "../repositories/settings-repository";
import { BuildRepository } from "../repositories/build-repository";

import { App } from "../frontend/app";

export async function Dashboard(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const state = {
    ...BuildRepository.getAll(),
    archiveArticles: await ArticleRepository.getAll(),
    archiveNewspapers: await NewspaperRepository.getAll(),
    articles: await ArticleRepository.getAllNonProcessed(),
    favouriteArticles: await ArticleRepository.getFavourite(),
    newspapers: await NewspaperRepository.getAllNonArchived(),
    settings: await SettingsRepository.getAll(),
    stats: await StatsRepository.getAll(),
  };

  const frontend = render(App({ ...state, url: request.url }));

  const html = Services.Html.process({
    content: frontend,
    state: serialize(state, { isJSON: true }),
  });

  return response.send(html);
}
