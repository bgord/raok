import express from "express";
import render from "preact-render-to-string";
import * as bg from "@bgord/node";

import * as infra from "../../../infra";

import * as Newspapers from "../../newspapers";
import * as Settings from "../../settings";
import * as Stats from "../../stats";
import * as Files from "../";

import { App } from "../../../frontend/app";

export async function FilesArchive(
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
    archiveArticles: await Newspapers.Repos.ArticleRepository.pagedGetAll(
      bg.Pagination.getFirstPage({ take: Newspapers.VO.ARTICLES_PER_PAGE })
    ),
    archiveFiles: await Files.Repos.FilesRepository.getAll(
      Files.Repos.ArchiveFilesFilter.parse(request.query)
    ),
    articles: await Newspapers.Repos.ArticleRepository.pagedGetAllNonProcessed(
      bg.Pagination.getFirstPage({ take: Newspapers.VO.ARTICLES_PER_PAGE })
    ),
    newspapers: await Newspapers.Repos.NewspaperRepository.getAllNonArchived(),
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
