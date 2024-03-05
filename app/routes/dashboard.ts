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
  _next: express.NextFunction,
) {
  const translations = await bg.I18n.getTranslations(
    request.language,
    request.translationsPath,
  );

  const pagination = bg.Pagination.parse(
    request.query,
    Newspapers.VO.ARTICLES_PER_PAGE,
  );

  const deviceManager = await Newspapers.Services.DeviceManager.build();

  const state = {
    ...(await bg.BuildInfoRepository.extract()),
    language: request.language,
    email: response.locals.user?.email as bg.Schema.EmailType,
    translations,
    archiveArticles: await Newspapers.Repos.ArticleRepository.pagedGetAll(
      bg.Pagination.getFirstPage({ take: Newspapers.VO.ARTICLES_PER_PAGE }),
      undefined,
      undefined,
    ),
    archiveFiles: [],
    articles:
      await Newspapers.Repos.ArticleRepository.pagedGetAllNonProcessed(
        pagination,
      ),
    newspapers: await Newspapers.Repos.NewspaperRepository.getAllNonArchived(),
    settings: await Settings.Repos.SettingsRepository.getAll(),
    sources: [],
    stats: await Stats.Repos.StatsRepository.getAll(),
    devices: deviceManager.list(),
  };

  const frontend = render(App({ ...state, url: request.url }));
  const html = infra.Html.process({
    frontend,
    state,
    language: request.language,
  });

  return response.send(html);
}
