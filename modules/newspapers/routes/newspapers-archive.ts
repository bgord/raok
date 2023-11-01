import express from "express";
import render from "preact-render-to-string";
import * as bg from "@bgord/node";

import * as infra from "../../../infra";
import * as Repos from "../repositories";

import * as Settings from "../../settings";
import * as Stats from "../../stats";

import { App } from "../../../frontend/app";

export async function NewspapersArchive(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const translations = await bg.I18n.getTranslations(
    request.language,
    request.translationsPath
  );

  const state = {
    ...(await bg.BuildInfoRepository.extract()),
    language: request.language,
    translations,
    archiveArticles: [],
    archiveNewspapers: await Repos.NewspaperRepository.getAll(
      Repos.ArchiveNewspaperFilter.parse(request.query)
    ),
    archiveFiles: [],
    articles: {
      result: [],
      meta: { ...bg.Pagination.empty.meta, previousPage: undefined },
    },
    newspapers: [],
    settings: await Settings.Repos.SettingsRepository.getAll(),
    sources: [],
    stats: await Stats.Repos.StatsRepository.getAll(),
  };

  const frontend = render(App({ ...state, url: "/archive/articles" }));
  const html = infra.Html.process({
    frontend,
    state,
    language: request.language,
  });

  return response.send(html);
}
