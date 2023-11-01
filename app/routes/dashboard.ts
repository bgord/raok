import express from "express";
import render from "preact-render-to-string";
import * as bg from "@bgord/node";

import * as Newspapers from "../../modules/newspapers";
import * as Settings from "../../modules/settings";
import * as Stats from "../../modules/stats";

import * as infra from "../../infra";

import { App } from "../../frontend/app";

export async function Dashboard(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const translations = await bg.I18n.getTranslations(
    request.language,
    request.translationsPath
  );

  const pagination = bg.Pagination.parse(
    request.query,
    Newspapers.VO.ARTICLES_PER_PAGE
  );

  const state = {
    ...(await bg.BuildInfoRepository.extract()),
    language: request.language,
    translations,
    archiveArticles: [],
    archiveNewspapers: [],
    archiveFiles: [],
    articles: await Newspapers.Repos.ArticleRepository.pagedGetAllNonProcessed(
      pagination
    ),
    newspapers: await Newspapers.Repos.NewspaperRepository.getAllNonArchived(),
    settings: await Settings.Repos.SettingsRepository.getAll(),
    sources: [],
    stats: await Stats.Repos.StatsRepository.getAll(),
  };

  const frontend = render(App({ ...state, url: request.url }));
  const html = infra.Html.process({
    frontend,
    state,
    language: request.language,
  });

  return response.send(html);
}
