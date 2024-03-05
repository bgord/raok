import express from "express";
import render from "preact-render-to-string";
import * as bg from "@bgord/node";

import * as Settings from "../../settings";
import * as Stats from "../../stats";
import * as Newspapers from "../../newspapers";

import * as infra from "../../../infra";

import * as Repos from "../repositories/source-repository";

import { App } from "../../../frontend/app";

export async function Sources(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction,
) {
  const translations = await bg.I18n.getTranslations(
    request.language,
    request.translationsPath,
  );

  const filters = Repos.SourceFilter.parse(request.query);
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
    sources: await Repos.SourceRepository.listAll(filters),
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
