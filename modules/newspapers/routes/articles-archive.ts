import express from "express";
import render from "preact-render-to-string";
import * as bg from "@bgord/node";

import * as Repos from "../repositories";
import * as infra from "../../../infra";

import * as VO from "../value-objects";
import * as Settings from "../../settings";
import * as Stats from "../../stats";

import { App } from "../../../frontend/app";

export async function ArticlesArchive(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const translations = await bg.I18n.getTranslations(
    request.language,
    request.translationsPath
  );

  const pagination = bg.Pagination.parse(request.query, VO.ARTICLES_PER_PAGE);

  const state = {
    ...(await bg.BuildInfoRepository.extract()),
    language: request.language,
    translations,
    archiveArticles: await Repos.ArticleRepository.pagedGetAll(
      pagination,
      undefined,
      Repos.ArchiveArticlesFilter.parse(request.query)
    ),
    archiveNewspapers: [],
    archiveFiles: [],
    articles: {
      result: [],
      meta: { ...bg.Pagination.empty.meta, previousPage: undefined },
    },
    newspapers: [],
    sources: [],
    settings: await Settings.Repos.SettingsRepository.getAll(),
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
