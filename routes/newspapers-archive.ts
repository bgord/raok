import express from "express";
import render from "preact-render-to-string";

import * as Services from "../services";
import * as Repos from "../repositories";

import { App } from "../frontend/app";

export async function NewspapersArchive(
  _request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const state = {
    ...Repos.BuildRepository.getAll(),
    archiveArticles: [],
    archiveNewspapers: await Repos.NewspaperRepository.getAll(),
    articles: [],
    favouriteArticles: [],
    newspapers: [],
    settings: await Repos.SettingsRepository.getAll(),
    stats: await Repos.StatsRepository.getAll(),
  };

  const frontend = render(App({ ...state, url: "/archive/articles" }));

  const html = Services.Html.process({ frontend, state });

  return response.send(html);
}
