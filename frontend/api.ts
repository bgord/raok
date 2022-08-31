import * as bg from "@bgord/frontend";
import { ServerError } from "./server-error";
import type { PageType } from "@bgord/node";

import * as types from "./types";

export const _api: typeof fetch = (input, init) =>
  fetch(input, {
    mode: "same-origin",
    headers: {
      "Content-Type": "application/json",

      "time-zone-offset": new Date().getTimezoneOffset().toString(),
    },
    redirect: "follow",
    ...init,
  })
    .then(ServerError.extract)
    .catch(ServerError.handle);

export async function getNewspapers(): Promise<types.NewspaperType[]> {
  return _api("/newspapers").then((response) =>
    response.ok ? response.json() : []
  );
}

export async function getArchiveNewspapers(
  filters?: bg.FilterType
): Promise<types.NewspaperType[]> {
  const url = new bg.FilterUrl("/newspapers/archive", filters).value;

  return _api(url).then((response) => (response.ok ? response.json() : []));
}

export async function getSingleNewspaper(
  id: types.NewspaperType["id"]
): Promise<types.NewspaperType> {
  return _api(`/newspaper/${id}`).then((response) =>
    response.ok ? response.json() : []
  );
}

export async function createNewspaper(articleIds: types.ArticleType["id"][]) {
  return _api("/create-newspaper", {
    method: "POST",
    body: JSON.stringify({ articleIds }),
  });
}

export async function archiveNewspaper(id: types.NewspaperType["id"]) {
  return _api(`/archive-newspaper/${id}`, { method: "POST" });
}

export async function cancelNewspaper(id: types.NewspaperType["id"]) {
  return _api(`/cancel-newspaper/${id}`, { method: "POST" });
}

export async function resendNewspaper(id: types.NewspaperType["id"]) {
  return _api(`/resend-newspaper/${id}`, { method: "POST" });
}

export async function getStats(): Promise<types.StatsType> {
  const defaultStats: types.StatsType = {
    createdArticles: 0,
    sentNewspapers: 0,
    lastFeedlyImport: null,
    lastFeedlyTokenExpiredError: null,
  };

  return _api("/stats", { method: "GET" }).then((response) =>
    response.ok ? response.json() : defaultStats
  );
}

export async function getPagedArticles(
  page: PageType
): Promise<bg.Paged<types.ArticleType>> {
  return _api(`/articles?page=${page}`, { method: "GET" }).then((response) =>
    response.ok ? response.json() : bg.Pagination.empty
  );
}

export async function getArticles(): Promise<types.ArticleType[]> {
  return _api("/articles", { method: "GET" }).then((response) =>
    response.ok ? response.json() : []
  );
}

export async function getFavouriteArticles(): Promise<types.ArticleType[]> {
  return _api("/articles/favourite", { method: "GET" }).then((response) =>
    response.ok ? response.json() : []
  );
}

export async function addArticle(article: types.ArticlePayloadType) {
  return _api("/add-article", {
    method: "POST",
    body: JSON.stringify(article),
  });
}

export async function deleteArticle(articleId: types.ArticleType["id"]) {
  return _api(`/delete-article/${articleId}`, { method: "POST" });
}

export async function undeleteArticle(articleId: types.ArticleType["id"]) {
  return _api(`/undelete-article/${articleId}`, { method: "POST" });
}

export async function addArticleToFavourites(
  articleId: types.ArticleType["id"]
) {
  return _api(`/article/${articleId}/favourite`, { method: "POST" });
}

export async function deleteArticleFromFavourites(
  articleId: types.ArticleType["id"]
) {
  return _api(`/article/${articleId}/unfavourite`, { method: "POST" });
}

export async function sendArbitraryFile(form: FormData) {
  return fetch("/send-arbitrary-file", {
    method: "POST",
    body: form,
  });
}

export async function scheduleFeedlyArticlesCrawl() {
  return _api("/schedule-feedly-articles-crawl", { method: "POST" });
}

export async function deleteOldArticles() {
  return _api("/articles/old/delete", { method: "POST" });
}

export async function deleteAllArticles() {
  return _api("/articles/all/delete", { method: "POST" });
}

export async function getArchiveArticles(
  filters?: bg.FilterType
): Promise<types.ArchiveArticleType[]> {
  const url = new bg.FilterUrl("/articles/archive", filters).value;

  return _api(url, { method: "GET" }).then((response) =>
    response.ok ? response.json() : []
  );
}

export async function getArchiveFiles(
  filters?: bg.FilterType
): Promise<types.ArchiveFileType[]> {
  const url = new bg.FilterUrl("/files/archive", filters).value;

  return _api(url, { method: "GET" }).then((response) =>
    response.ok ? response.json() : []
  );
}

export async function getSettings(): Promise<types.SettingsType> {
  return _api("/account/settings", { method: "GET" }).then((response) =>
    response.json()
  );
}

export async function stopFeedlyCrawling() {
  return _api("/stop-feedly-crawling", { method: "POST" });
}

export async function restoreFeedlyCrawling() {
  return _api("/restore-feedly-crawling", { method: "POST" });
}
