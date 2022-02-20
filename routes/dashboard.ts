import express from "express";
import render from "preact-render-to-string";

import * as Services from "../services";
import * as Repos from "../repositories";

import { App } from "../frontend/app";

export async function Dashboard(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const timeZoneOffsetMs = request.timeZoneOffset.miliseconds;

  const state = {
    ...Repos.BuildRepository.getAll(),
    archiveArticles: await Repos.ArticleRepository.getAll(),
    archiveNewspapers: await Repos.NewspaperRepository.getAll(timeZoneOffsetMs),
    articles: await Repos.ArticleRepository.getAllNonProcessed(),
    favouriteArticles: await Repos.ArticleRepository.getFavourite(),
    newspapers: await Repos.NewspaperRepository.getAllNonArchived(
      timeZoneOffsetMs
    ),
    settings: await Repos.SettingsRepository.getAll(),
    stats: await Repos.StatsRepository.getAll(timeZoneOffsetMs),
  };

  const frontend = render(App({ ...state, url: request.url }));

  const html = Services.Html.process({ frontend, state });

  return response.send(html);
}
