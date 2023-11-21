import type { Article } from "../infra/db";
import type { AsyncReturnType } from "@bgord/node";
import type * as bg from "@bgord/frontend";

import type { ArticleRepository } from "../modules/newspapers/repositories/article-repository";
import type { NewspaperRepository } from "../modules/newspapers/repositories/newspaper-repository";
import type { StatsRepository } from "../modules/stats/repositories/stats-repository";
import type { SettingsRepository } from "../modules/settings/repositories/settings-repository";
import type { FilesRepository } from "../modules/files/repositories/files-repository";
import type { SourceRepository } from "../modules/rss/repositories/source-repository";

export type { HourType } from "@bgord/node/dist/schema";
export type { ArticleSearchQueryType } from "../modules/newspapers/value-objects/article-search-query";

export enum ArticleSourceEnum {
  web = "web",
  feedly = "feedly",
}

export enum ArticleStatusEnum {
  "ready" = "ready",
  "in_progress" = "in_progress",
  "processed" = "processed",
  "deleted" = "deleted",
}

export enum NewspaperStatusEnum {
  "delivered" = "delivered",
  "archived" = "archived",
  "error" = "error",
}

export type ArticlePayloadType = Pick<Article, "url">;
export type ArticleType = AsyncReturnType<
  typeof ArticleRepository["pagedGetAllNonProcessed"]
>["result"][0];

export type ArchiveArticleType = AsyncReturnType<
  typeof ArticleRepository["pagedGetAll"]
>["result"][0];

export type NewspaperType = AsyncReturnType<
  typeof NewspaperRepository["getAllNonArchived"]
>[0];

export type StatsType = AsyncReturnType<typeof StatsRepository["getAll"]>;
export type SettingsType = AsyncReturnType<typeof SettingsRepository["getAll"]>;

export type ToastType = bg.BaseToastType & {
  articleId?: ArticleType["id"] | null;
  articleTitle?: ArticleType["title"] | null;
  revision?: ArticleType["revision"] | null;
};

export type ArchiveFileType = AsyncReturnType<
  typeof FilesRepository["getAll"]
>[0];

export type SourceType = AsyncReturnType<typeof SourceRepository["listAll"]>[0];

export { SourceStatusEnum } from "../modules/rss/value-objects/source-status-enum";
export { SOURCE_URL_MIN_LENGTH } from "../modules/rss/value-objects/source-url-min-length";
export { SOURCE_URL_MAX_LENGTH } from "../modules/rss/value-objects/source-url-max-length";

export { MAX_UPLOADED_FILE_SIZE_BYTES } from "../modules/files/value-objects/max-uploaded-file-size";
export { FileMimeTypes } from "../modules/files/value-objects/file-mime-types";

export { ARTICLE_OLD_MARKER_IN_DAYS } from "../modules/newspapers/value-objects/article-old-marker-in-days";

export { NEWSPAPER_MAX_ARTICLES_NUMBER } from "../modules/newspapers/value-objects/newspaper-max-articles-number";

export { ARTICLE_SEARCH_QUERY_MIN_LENGTH } from "../modules/newspapers/value-objects/article-search-query-min-length";
export { ARTICLE_SEARCH_QUERY_MAX_LENGTH } from "../modules/newspapers/value-objects/article-search-query-max-length";

export { ARTICLE_URL_MAX_CHARS } from "../modules/newspapers/value-objects/article-url-max-chars";
