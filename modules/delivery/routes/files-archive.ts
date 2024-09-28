import express from "express";
import render from "preact-render-to-string";
import * as bg from "@bgord/node";

import * as infra from "../../../infra";

import * as Newspapers from "../../newspapers";
import * as Stats from "../../stats";
import * as Delivery from "../";

import { App } from "../../../frontend/app";

/** @public */
export async function FilesArchive(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction,
) {
  const translations = await bg.I18n.getTranslations(
    request.language,
    request.translationsPath,
  );

  const deviceManager = await Delivery.Services.DeviceManager.build();

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
    archiveFiles: await Delivery.Repos.FilesRepository.getAll(
      Delivery.Repos.ArchiveFilesFilter.parse(request.query),
    ),
    articles: await Newspapers.Repos.ArticleRepository.pagedGetAllNonProcessed(
      bg.Pagination.getFirstPage({ take: Newspapers.VO.ARTICLES_PER_PAGE }),
    ),
    newspapers: await Newspapers.Repos.NewspaperRepository.getAllNonArchived(),
    sources: [],
    stats: await Stats.Repos.StatsRepository.getAll(),
    devices: deviceManager.list(),
  };

  const frontend = render(App({ ...state, url: "/archive/articles" }));
  const html = infra.Html.process({
    frontend,
    state,
    language: request.language,
  });

  response.send(html);
}
