import * as bg from "@bgord/frontend";
import type { PageType } from "@bgord/node";

import * as types from "./types";
import { ServerError } from "./server-error";

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
    numberOfNonProcessedArticles: 0,
    hasFeedlyTokenExpired: true,
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

export async function searchArticles(
  query: types.ArticleSearchQueryType
): Promise<types.ArticleType[]> {
  if (query.length === 0) return [];

  return _api(`/articles/search?query=${query}`, { method: "GET" }).then(
    (response) => (response.ok ? response.json() : [])
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

export class Settings {
  static async getSettings(): Promise<types.SettingsType> {
    return _api("/account/settings", { method: "GET" }).then((response) =>
      response.json()
    );
  }

  static async stopFeedlyCrawling() {
    return _api("/stop-feedly-crawling", { method: "POST" });
  }

  static async restoreFeedlyCrawling() {
    return _api("/restore-feedly-crawling", { method: "POST" });
  }

  static async enableArticlesToReviewNotification() {
    return _api("/enable-articles-to-review-notification", { method: "POST" });
  }

  static async disableArticlesToReviewNotification() {
    return _api("/disable-articles-to-review-notification", { method: "POST" });
  }

  static async setArticlesToReviewNotificationHour(hour: types.HourType) {
    return _api("/set-articles-to-review-notification-hour", {
      method: "POST",
      body: JSON.stringify({ hour }),
    });
  }
}
