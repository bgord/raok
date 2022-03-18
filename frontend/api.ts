import type { Prisma } from "@prisma/client";

import {
  ArticleType,
  ArchiveArticleType,
  ArticlePayloadType,
  NewspaperType,
  StatsType,
  SettingsType,
} from "./types";

export const _api: typeof fetch = (input, init) =>
  fetch(input, {
    mode: "same-origin",
    headers: {
      "Content-Type": "application/json",

      "time-zone-offset": new Date().getTimezoneOffset().toString(),
    },
    redirect: "follow",
    ...init,
  });

export async function getNewspapers(): Promise<NewspaperType[]> {
  return _api("/newspapers").then((response) =>
    response.ok ? response.json() : []
  );
}

export async function getArchiveNewspapers(): Promise<NewspaperType[]> {
  return _api("/newspapers/archive").then((response) =>
    response.ok ? response.json() : []
  );
}

export async function getSingleNewspaper(
  id: NewspaperType["id"]
): Promise<NewspaperType> {
  return _api(`/newspaper/${id}`).then((response) =>
    response.ok ? response.json() : []
  );
}

export async function createNewspaper(articleIds: ArticleType["id"][]) {
  return _api("/create-newspaper", {
    method: "POST",
    body: JSON.stringify({ articleIds }),
  });
}

export async function archiveNewspaper(id: NewspaperType["id"]) {
  return _api(`/archive-newspaper/${id}`, { method: "POST" });
}

export async function cancelNewspaper(id: NewspaperType["id"]) {
  return _api(`/cancel-newspaper/${id}`, { method: "POST" });
}

export async function resendNewspaper(id: NewspaperType["id"]) {
  return _api(`/resend-newspaper/${id}`, { method: "POST" });
}

export async function getStats(): Promise<StatsType> {
  const defaultStats: StatsType = {
    createdArticles: 0,
    sentNewspapers: 0,
    lastFeedlyImport: null,
  };

  return _api("/stats", { method: "GET" }).then((response) =>
    response.ok ? response.json() : defaultStats
  );
}

export async function getArticles(): Promise<ArticleType[]> {
  return _api("/articles", { method: "GET" }).then((response) =>
    response.ok ? response.json() : []
  );
}

export async function getFavouriteArticles(): Promise<ArticleType[]> {
  return _api("/articles/favourite", { method: "GET" }).then((response) =>
    response.ok ? response.json() : []
  );
}

export async function addArticle(article: ArticlePayloadType) {
  return _api("/add-article", {
    method: "POST",
    body: JSON.stringify(article),
  });
}

export async function deleteArticle(articleId: ArticleType["id"]) {
  return _api(`/delete-article/${articleId}`, { method: "POST" });
}

export async function addArticleToFavourites(articleId: ArticleType["id"]) {
  return _api(`/article/${articleId}/favourite`, { method: "POST" });
}

export async function deleteArticleFromFavourites(
  articleId: ArticleType["id"]
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

export async function getArchiveArticles(
  filters?: Prisma.ArticleWhereInput
): Promise<ArchiveArticleType[]> {
  const query = new URLSearchParams(nonEmptyFilters(filters));

  return _api(`/articles/archive?${query.toString()}`, { method: "GET" }).then(
    (response) => (response.ok ? response.json() : [])
  );
}

export async function getSettings(): Promise<SettingsType> {
  return _api("/account/settings", { method: "GET" }).then((response) =>
    response.json()
  );
}

function nonEmptyFilters(filters: Record<string, unknown> | undefined) {
  if (filters === undefined) return {};

  return Object.fromEntries(
    Object.entries(filters).filter(([_key, value]) => value !== undefined)
  ) as Record<string, string>;
}
