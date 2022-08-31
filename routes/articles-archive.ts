import express from "express";
import render from "preact-render-to-string";
import * as bg from "@bgord/node";

import * as Services from "../services";
import * as Repos from "../repositories";

import { App } from "../frontend/app";

export async function ArticlesArchive(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const translations = await bg.Language.getTranslations(
    request.language,
    request.translationsPath
  );

  const state = {
    ...Repos.BuildRepository.getAll(),
    language: request.language,
    translations,
    archiveArticles: await Repos.ArticleRepository.getAll(
      Repos.ArchiveArticlesFilter.parse(request.query)
    ),
    archiveNewspapers: [],
    archiveFiles: [],
    articles: bg.Pagination.empty,
    favouriteArticles: [],
    newspapers: [],
    settings: await Repos.SettingsRepository.getAll(),
    stats: await Repos.StatsRepository.getAll(),
  };

  const frontend = render(App({ ...state, url: "/archive/articles" }));
  const html = Services.Html.process({
    frontend,
    state,
    language: request.language,
  });

  return response.send(html);
}
