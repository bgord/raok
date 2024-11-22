import * as bg from "@bgord/frontend";

import * as types from "./types";

export const keys = {
  stats: ["stats"],
  sources: ["sources"],
  sourcePreview: (id: types.SourceType["id"]) => ["source-preview", id],
  allSources: ["sources"],
  settings: ["settings"],
  articles: ["articles"],
  newspapers: ["newspapers"],
  articlesSearch: ["articles-search"],
  archiveArticles: (
    filters: Record<string, unknown>,
    search: string | undefined
  ) => ["archive-articles", filters, search],
  allArchiveFiles: ["archive-files"],
  allArchiveArticles: ["archive-articles"],
  tokenBlacklist: ["token-blacklist"],
  tokenBlacklistSuggestions: ["token-blacklist-suggestions"],
  allDevices: ["devices"],
};

export class Article {
  static async opened(id: types.ArticleType["id"]) {
    return bg.API(`/article/${id}/opened`, { method: "POST" });
  }

  static async homepageOpened(id: types.ArticleType["id"]) {
    return bg.API(`/article/${id}/homepage-opened`, { method: "POST" });
  }

  static async delete(payload: Pick<types.ArticleType, "id" | "revision">) {
    return bg.API(`/delete-article/${payload.id}`, {
      method: "POST",
      headers: bg.WeakETag.fromRevision(payload.revision),
    });
  }

  static async markAsRead(payload: Pick<types.ArticleType, "id" | "revision">) {
    return bg.API(`/article/${payload.id}/mark-as-read`, {
      method: "POST",
      headers: bg.WeakETag.fromRevision(payload.revision),
    });
  }

  static async undelete(payload: Pick<types.ArticleType, "id" | "revision">) {
    return bg.API(`/undelete-article/${payload.id}`, {
      method: "POST",
      headers: bg.WeakETag.fromRevision(payload.revision),
    });
  }

  static async add(article: types.ArticlePayloadType) {
    return bg.API("/add-article", {
      method: "POST",
      body: JSON.stringify(article),
    });
  }

  static async listPaged(
    page: bg.PageType
  ): Promise<bg.Paged<types.ArticleType>> {
    return bg
      .API(`/articles?page=${page}`, { method: "GET" })
      .then((response) =>
        response.ok ? response.json() : bg.Pagination.empty
      );
  }

  static async search(
    _query: types.ArticleSearchQueryType
  ): Promise<types.ArticleType[]> {
    if (_query.length === 0) return [];

    const query = encodeURIComponent(_query);

    return bg
      .API(`/articles/search?query=${query}`, { method: "GET" })
      .then((response) => (response.ok ? response.json() : []));
  }
}

export class Newspaper {
  static async list(): Promise<types.NewspaperType[]> {
    return bg
      .API("/newspapers")
      .then((response) => (response.ok ? response.json() : []));
  }

  static async getSingle(
    id: types.NewspaperType["id"]
  ): Promise<types.NewspaperType> {
    return bg
      .API(`/newspaper/${id}`)
      .then((response) => (response.ok ? response.json() : []));
  }

  static async create(articleIds: types.ArticleType["id"][]) {
    return bg.API("/create-newspaper", {
      method: "POST",
      body: JSON.stringify({ articleIds }),
    });
  }

  static async archive(payload: Pick<types.NewspaperType, "id" | "revision">) {
    return bg.API(`/archive-newspaper/${payload.id}`, {
      method: "POST",
      headers: bg.WeakETag.fromRevision(payload.revision),
    });
  }

  static async cancel(payload: Pick<types.NewspaperType, "id" | "revision">) {
    return bg.API(`/cancel-newspaper/${payload.id}`, {
      method: "POST",
      headers: bg.WeakETag.fromRevision(payload.revision),
    });
  }

  static async resend(payload: Pick<types.NewspaperType, "id" | "revision">) {
    return bg.API(`/resend-newspaper/${payload.id}`, {
      method: "POST",
      headers: bg.WeakETag.fromRevision(payload.revision),
    });
  }
}

export async function getStats(): Promise<types.StatsType> {
  const defaultStats: types.StatsType = {
    createdArticles: 0,
    sentNewspapers: 0,
    numberOfNonProcessedArticles: 0,
    articlesPerDay: null,
    openedArticles: 0,
    readArticles: 0,
    sentArticles: 0,
  };

  return bg
    .API("/stats", { method: "GET" })
    .then((response) => (response.ok ? response.json() : defaultStats));
}

export async function sendArbitraryFile(form: FormData) {
  return fetch("/send-arbitrary-file", {
    method: "POST",
    body: form,
  });
}

export class Archive {
  static async getArticles(
    page: bg.PageType,
    filters: bg.FilterType,
    search: string | undefined
  ): Promise<bg.Paged<types.ArchiveArticleType>> {
    const url = new bg.FilterUrl("/articles/archive", {
      ...filters,
      page,
      search,
    });

    return bg
      .API(url.value, { method: "GET" })
      .then((response) =>
        response.ok ? response.json() : bg.Pagination.empty
      );
  }
}

export class Source {
  static async list(): Promise<types.SourceType[]> {
    return bg
      .API("/rss/source/list", { method: "GET" })
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

  static async preview(
    id: types.SourceType["id"]
  ): Promise<{ url: string; createdAt: { raw: number; relative: string } }[]> {
    return bg
      .API(`/rss/source/${id}/preview`, { method: "GET" })
      .then((response) => (response.ok ? response.json() : []));
  }
}

export class TokenBlacklist {
  static async create(payload: Pick<types.TokenBlacklistType, "token">) {
    return bg.API("/token-blacklist/create", {
      method: "POST",
      body: JSON.stringify({ token: payload.token }),
    });
  }

  static async list(): Promise<types.TokenBlacklistType[]> {
    return bg
      .API("/token-blacklist")
      .then((response) => (response.ok ? response.json() : []));
  }

  static async delete(payload: Pick<types.TokenBlacklistType, "token">) {
    return bg.API("/token-blacklist/delete", {
      method: "POST",
      body: JSON.stringify({ token: payload.token }),
    });
  }

  static async listSuggestions(): Promise<types.TokenBlacklistType[]> {
    return bg
      .API("/token-blacklist/suggestions")
      .then((response) => (response.ok ? response.json() : []));
  }

  static async dismissSuggestion(token: types.TokenBlacklistType["token"]) {
    return bg.API("/token-blacklist/suggestions/dismiss", {
      method: "DELETE",
      body: JSON.stringify({ token }),
    });
  }
}

export class NewspaperLink {
  static getDownload(newspaper: types.NewspaperType): string {
    return `/newspaper/${newspaper.id}/read`;
  }

  static getFull(newspaper: types.NewspaperType): string {
    const safeWindow = bg.getSafeWindow();
    return `${safeWindow?.location.origin}/newspaper/${newspaper.id}/read`;
  }
}

export class Devices {
  static async list(): Promise<types.DeviceType[]> {
    return bg
      .API("/device/list", { method: "GET" })
      .then((response) => (response.ok ? response.json() : []));
  }

  static async create(payload: Pick<types.DeviceType, "name" | "email">) {
    return bg.API("/device/create", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  static async delete(payload: Pick<types.DeviceType, "id">) {
    return bg.API(`/device/${payload.id}/delete`, { method: "POST" });
  }
}
