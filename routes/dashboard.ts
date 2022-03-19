import express from "express";
import render from "preact-render-to-string";
import { Language } from "@bgord/node";

import * as Services from "../services";
import * as Repos from "../repositories";

import { App } from "../frontend/app";

export async function Dashboard(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const translations = await Language.getTranslations(
    request.language,
    request.translationsPath
  );

  const state = {
    ...Repos.BuildRepository.getAll(),
    language: request.language,
    translations,
    archiveArticles: [],
    archiveNewspapers: [],
    articles: await Repos.ArticleRepository.getAllNonProcessed(),
    favouriteArticles: await Repos.ArticleRepository.getFavourite(),
    newspapers: await Repos.NewspaperRepository.getAllNonArchived(),
    settings: await Repos.SettingsRepository.getAll(),
    stats: await Repos.StatsRepository.getAll(),
  };

  const frontend = render(App({ ...state, url: request.url }));
  const html = Services.Html.process({
    frontend,
    state,
    language: request.language,
  });

  return response.send(html);
}
