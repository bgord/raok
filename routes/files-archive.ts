import express from "express";
import render from "preact-render-to-string";
import { Language } from "@bgord/node";

import * as VO from "../value-objects";
import * as Services from "../services";
import * as Repos from "../repositories";
import * as WIP from "../pagination";

import { App } from "../frontend/app";

export async function FilesArchive(
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
    archiveNewspapers: await Repos.NewspaperRepository.getAll(
      Repos.ArchiveNewspaperFilter.parse(request.query)
    ),
    archiveFiles: await Repos.FilesRepository.getAll(
      Repos.ArchiveFilesFilter.parse(request.query)
    ),
    articles: await Repos.ArticleRepository.pagedGetAllNonProcessed(
      WIP.Pagination.getFirstPage({ take: VO.ARTICLES_PER_PAGE })
    ),
    favouriteArticles: [],
    newspapers: await Repos.NewspaperRepository.getAllNonArchived(),
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
