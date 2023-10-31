import * as bg from "@bgord/frontend";

import * as types from "./types";

export async function getNewspapers(): Promise<types.NewspaperType[]> {
  return bg
    .API("/newspapers")
    .then((response) => (response.ok ? response.json() : []));
}

export async function getArchiveNewspapers(
  filters?: bg.FilterType
): Promise<types.NewspaperType[]> {
  const url = new bg.FilterUrl("/newspapers/archive", filters).value;

  return bg.API(url).then((response) => (response.ok ? response.json() : []));
}

export async function getSingleNewspaper(
  id: types.NewspaperType["id"]
): Promise<types.NewspaperType> {
  return bg
    .API(`/newspaper/${id}`)
    .then((response) => (response.ok ? response.json() : []));
}

export async function createNewspaper(articleIds: types.ArticleType["id"][]) {
  return bg.API("/create-newspaper", {
    method: "POST",
    body: JSON.stringify({ articleIds }),
  });
}

export async function archiveNewspaper(id: types.NewspaperType["id"]) {
  return bg.API(`/archive-newspaper/${id}`, { method: "POST" });
}

export async function cancelNewspaper(id: types.NewspaperType["id"]) {
  return bg.API(`/cancel-newspaper/${id}`, { method: "POST" });
}

export async function resendNewspaper(id: types.NewspaperType["id"]) {
  return bg.API(`/resend-newspaper/${id}`, { method: "POST" });
}

export async function getStats(): Promise<types.StatsType> {
  const defaultStats: types.StatsType = {
    createdArticles: 0,
    sentNewspapers: 0,
    numberOfNonProcessedArticles: 0,
  };

  return bg
    .API("/stats", { method: "GET" })
    .then((response) => (response.ok ? response.json() : defaultStats));
}

export async function getPagedArticles(
  page: bg.PageType
): Promise<bg.Paged<types.ArticleType>> {
  return bg
    .API(`/articles?page=${page}`, { method: "GET" })
    .then((response) => (response.ok ? response.json() : bg.Pagination.empty));
}

export async function searchArticles(
  _query: types.ArticleSearchQueryType
): Promise<types.ArticleType[]> {
  if (_query.length === 0) return [];

  const query = encodeURIComponent(_query);

  return bg
    .API(`/articles/search?query=${query}`, { method: "GET" })
    .then((response) => (response.ok ? response.json() : []));
}

export async function addArticle(article: types.ArticlePayloadType) {
  return bg.API("/add-article", {
    method: "POST",
    body: JSON.stringify(article),
  });
}

export async function deleteArticle(articleId: types.ArticleType["id"]) {
  return bg.API(`/delete-article/${articleId}`, { method: "POST" });
}

export async function undeleteArticle(articleId: types.ArticleType["id"]) {
  return bg.API(`/undelete-article/${articleId}`, { method: "POST" });
}

export async function sendArbitraryFile(form: FormData) {
  return fetch("/send-arbitrary-file", {
    method: "POST",
    body: form,
  });
}

export async function deleteOldArticles() {
  return bg.API("/articles/old/delete", { method: "POST" });
}

export async function deleteAllArticles() {
  return bg.API("/articles/all/delete", { method: "POST" });
}

export async function getArchiveArticles(
  filters?: bg.FilterType
): Promise<types.ArchiveArticleType[]> {
  const url = new bg.FilterUrl("/articles/archive", filters).value;

  return bg
    .API(url, { method: "GET" })
    .then((response) => (response.ok ? response.json() : []));
}

export async function getArchiveFiles(
  filters?: bg.FilterType
): Promise<types.ArchiveFileType[]> {
  const url = new bg.FilterUrl("/files/archive", filters).value;

  return bg
    .API(url, { method: "GET" })
    .then((response) => (response.ok ? response.json() : []));
}

export class Settings {
  static async getSettings(): Promise<types.SettingsType> {
    return bg
      .API("/account/settings", { method: "GET" })
      .then((response) => response.json());
  }

  static async enableArticlesToReviewNotification() {
    return bg.API("/enable-articles-to-review-notification", {
      method: "POST",
    });
  }

  static async disableArticlesToReviewNotification() {
    return bg.API("/disable-articles-to-review-notification", {
      method: "POST",
    });
  }

  static async setArticlesToReviewNotificationHour(hour: types.HourType) {
    return bg.API("/set-articles-to-review-notification-hour", {
      method: "POST",
      body: JSON.stringify({ hour }),
    });
  }
}

export class Source {
  static async list(): Promise<types.SourceType[]> {
    return bg
      .API("/rss/source/list", { method: "GET" })
      .then((response) => response.json());
  }

  static async reactivate(id: Pick<types.SourceType, "id">) {
    return bg.API(`/rss/source/${id}/reactivate`, { method: "POST" });
  }

  static async archive(id: Pick<types.SourceType, "id">) {
    return bg.API(`/rss/source/${id}/archive`, { method: "POST" });
  }

  static async delete(id: Pick<types.SourceType, "id">) {
    return bg.API(`/rss/source/${id}`, { method: "DELETE" });
  }

  static async create(url: Pick<types.SourceType, "url">) {
    return bg.API("/rss/source/create", {
      method: "POST",
      body: JSON.stringify({ url }),
    });
  }
}
