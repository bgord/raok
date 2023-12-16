import * as bg from "@bgord/frontend";

import * as types from "./types";

export const keys = {
  stats: ["stats"],
  sources: (filters: Record<string, unknown>) => ["sources", filters],
  allSources: ["sources"],
  settings: ["settings"],
  articles: ["articles"],
  newspapers: ["newspapers"],
  articlesSearch: ["articles-search"],
  archiveFiles: (filters: Record<string, unknown>) => [
    "archive-files",
    filters,
  ],
  archiveArticles: (
    filters: Record<string, unknown>,
    search: string | undefined
  ) => ["archive-articles", filters, search],
  allArchiveFiles: ["archive-files"],
  allArchiveArticles: ["archive-articles"],
};

export async function getNewspapers(): Promise<types.NewspaperType[]> {
  return bg
    .API("/newspapers")
    .then((response) => (response.ok ? response.json() : []));
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

export async function archiveNewspaper(
  payload: Pick<types.NewspaperType, "id" | "revision">
) {
  return bg.API(`/archive-newspaper/${payload.id}`, {
    method: "POST",
    headers: bg.WeakETag.fromRevision(payload.revision),
  });
}

export async function cancelNewspaper(
  payload: Pick<types.NewspaperType, "id" | "revision">
) {
  return bg.API(`/cancel-newspaper/${payload.id}`, {
    method: "POST",
    headers: bg.WeakETag.fromRevision(payload.revision),
  });
}

export async function resendNewspaper(
  payload: Pick<types.NewspaperType, "id" | "revision">
) {
  return bg.API(`/resend-newspaper/${payload.id}`, {
    method: "POST",
    headers: bg.WeakETag.fromRevision(payload.revision),
  });
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

export async function deleteArticle(
  payload: Pick<types.ArticleType, "id" | "revision">
) {
  return bg.API(`/delete-article/${payload.id}`, {
    method: "POST",
    headers: bg.WeakETag.fromRevision(payload.revision),
  });
}

export async function undeleteArticle(
  payload: Pick<types.ArticleType, "id" | "revision">
) {
  return bg.API(`/undelete-article/${payload.id}`, {
    method: "POST",
    headers: bg.WeakETag.fromRevision(payload.revision),
  });
}

export async function articleMarkAsRead(
  payload: Pick<types.ArticleType, "id" | "revision">
) {
  return bg.API(`/article/${payload.id}/mark-as-read`, {
    method: "POST",
    headers: bg.WeakETag.fromRevision(payload.revision),
  });
}

export async function sendArbitraryFile(form: FormData) {
  return fetch("/send-arbitrary-file", {
    method: "POST",
    body: form,
  });
}

export async function getArchiveArticles(
  page: bg.PageType,
  filters: bg.FilterType,
  search: string | undefined
): Promise<bg.Paged<types.ArchiveArticleType>> {
  const url = new bg.FilterUrl(`/articles/archive`, {
    ...filters,
    page,
    search,
  });

  return bg
    .API(url.value, { method: "GET" })
    .then((response) => (response.ok ? response.json() : bg.Pagination.empty));
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
  static async list(filters?: bg.FilterType): Promise<types.SourceType[]> {
    const url = new bg.FilterUrl("/rss/source/list", filters).value;

    return bg
      .API(url, { method: "GET" })
      .then((response) => (response.ok ? response.json() : []));
  }

  static async reactivate(payload: Pick<types.SourceType, "id" | "revision">) {
    return bg.API(`/rss/source/${payload.id}/reactivate`, {
      method: "POST",
      headers: bg.WeakETag.fromRevision(payload.revision),
    });
  }

  static async archive(payload: Pick<types.SourceType, "id" | "revision">) {
    return bg.API(`/rss/source/${payload.id}/archive`, {
      method: "POST",
      headers: bg.WeakETag.fromRevision(payload.revision),
    });
  }

  static async delete(payload: Pick<types.SourceType, "id" | "revision">) {
    return bg.API(`/rss/source/${payload.id}`, {
      method: "DELETE",
      headers: bg.WeakETag.fromRevision(payload.revision),
    });
  }

  static async create(url: types.SourceType["url"]) {
    return bg.API("/rss/source/create", {
      method: "POST",
      body: JSON.stringify({ url }),
    });
  }
}

export class Reordering {
  static async transfer(config: bg.ReorderingTransferType) {
    return bg.API(`/reordering/${config.correlationId}/transfer`, {
      method: "POST",
      body: JSON.stringify({ id: config.id, to: config.to }),
    });
  }
}
