import {
  ArticleType,
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
      TimeZoneOffset: new Date().getTimezoneOffset().toString(),
    },
    redirect: "follow",
    ...init,
  });

async function getNewspapers(): Promise<NewspaperType[]> {
  return _api("/newspapers").then((response) =>
    response.ok ? response.json() : []
  );
}

async function getArchiveNewspapers(): Promise<NewspaperType[]> {
  return _api("/newspapers/archive").then((response) =>
    response.ok ? response.json() : []
  );
}

async function getSingleNewspaper(
  id: NewspaperType["id"]
): Promise<NewspaperType> {
  return _api(`/newspaper/${id}`).then((response) =>
    response.ok ? response.json() : []
  );
}

async function createNewspaper(articleIds: ArticleType["id"][]) {
  return _api("/create-newspaper", {
    method: "POST",
    body: JSON.stringify({ articleIds }),
  });
}

async function archiveNewspaper(id: NewspaperType["id"]) {
  return _api(`/archive-newspaper/${id}`, { method: "POST" });
}

async function cancelNewspaper(id: NewspaperType["id"]) {
  return _api(`/cancel-newspaper/${id}`, { method: "POST" });
}

async function resendNewspaper(id: NewspaperType["id"]) {
  return _api(`/resend-newspaper/${id}`, { method: "POST" });
}

async function getStats(): Promise<StatsType> {
  const defaultStats: StatsType = {
    createdArticles: 0,
    sentNewspapers: 0,
    lastFeedlyImport: 0,
  };

  return _api("/stats", { method: "GET" }).then((response) =>
    response.ok ? response.json() : defaultStats
  );
}

async function getArticles(): Promise<ArticleType[]> {
  return _api("/articles", { method: "GET" }).then((response) =>
    response.ok ? response.json() : []
  );
}

async function getFavouriteArticles(): Promise<ArticleType[]> {
  return _api("/articles/favourite", { method: "GET" }).then((response) =>
    response.ok ? response.json() : []
  );
}

async function addArticle(article: ArticlePayloadType) {
  return _api("/add-article", {
    method: "POST",
    body: JSON.stringify(article),
  });
}

async function deleteArticle(articleId: ArticleType["id"]) {
  return _api(`/delete-article/${articleId}`, { method: "POST" });
}

async function addArticleToFavourites(articleId: ArticleType["id"]) {
  return _api(`/article/${articleId}/favourite`, { method: "POST" });
}

async function deleteArticleFromFavourites(articleId: ArticleType["id"]) {
  return _api(`/article/${articleId}/unfavourite`, { method: "POST" });
}

async function sendArbitraryFile(form: FormData) {
  return fetch("/send-arbitrary-file", {
    method: "POST",
    body: form,
  });
}

async function scheduleFeedlyArticlesCrawl() {
  return _api("/schedule-feedly-articles-crawl", { method: "POST" });
}

async function getArchiveArticles(): Promise<ArticleType[]> {
  return _api("/articles/archive", { method: "GET" }).then((response) =>
    response.ok ? response.json() : []
  );
}

async function getSettings(): Promise<SettingsType> {
  return _api("/account/settings", { method: "GET" }).then((response) =>
    response.json()
  );
}

export const api = {
  getNewspapers,
  getArchiveNewspapers,
  getSingleNewspaper,
  createNewspaper,
  archiveNewspaper,
  cancelNewspaper,
  resendNewspaper,
  getStats,
  getArticles,
  addArticle,
  deleteArticle,
  sendArbitraryFile,
  getFavouriteArticles,
  addArticleToFavourites,
  deleteArticleFromFavourites,
  scheduleFeedlyArticlesCrawl,
  getArchiveArticles,
  getSettings,
};
