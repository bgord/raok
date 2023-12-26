import type { Article } from "../infra/db";
import type { AsyncReturnType } from "@bgord/node";
import type * as bg from "@bgord/frontend";

import type { ArticleRepository } from "../modules/newspapers/repositories/article-repository";
import type { NewspaperRepository } from "../modules/newspapers/repositories/newspaper-repository";
import type { StatsRepository } from "../modules/stats/repositories/stats-repository";
import type { SettingsRepository } from "../modules/settings/repositories/settings-repository";
import type { FilesRepository } from "../modules/files/repositories/files-repository";
import type { SourceRepository } from "../modules/rss/repositories/source-repository";
import type { TokenBlacklistRepository } from "../modules/recommendations/repositories/token-blacklist-repository";

/**
 * @public
 */
export type { HourType } from "@bgord/node/dist/schema";
/**
 * @public
 */
export type { ArticleSearchQueryType } from "../modules/newspapers/value-objects/article-search-query";

/**
 * @public
 */
export enum ArticleSourceEnum {
  web = "web",
  feedly = "feedly",
}

/**
 * @public
 */
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

export type TokenBlacklistType = AsyncReturnType<
  typeof TokenBlacklistRepository["list"]
>[0];

export enum SourceStatusEnum {
  "active" = "active",
  "inactive" = "inactive",
}
import { SOURCE_URL_MIN_LENGTH } from "../modules/rss/value-objects/source-url-min-length";
import { SOURCE_URL_MAX_LENGTH } from "../modules/rss/value-objects/source-url-max-length";

export { MAX_UPLOADED_FILE_SIZE_BYTES } from "../modules/files/value-objects/max-uploaded-file-size";
export { FileMimeTypes } from "../modules/files/value-objects/file-mime-types";

export { NEWSPAPER_MAX_ARTICLES_NUMBER } from "../modules/newspapers/value-objects/newspaper-max-articles-number";

import { ARTICLE_SEARCH_QUERY_MIN_LENGTH } from "../modules/newspapers/value-objects/article-search-query-min-length";
import { ARTICLE_SEARCH_QUERY_MAX_LENGTH } from "../modules/newspapers/value-objects/article-search-query-max-length";

import { ARTICLE_URL_MAX_CHARS } from "../modules/newspapers/value-objects/article-url-max-chars";
export { ArticleStatusEnum } from "../modules/newspapers/value-objects/article-status-enum";

export { ArticleRatingLevel } from "../modules/newspapers/value-objects/article-rating-level-enum";

export enum SourceSortEnum {
  default = "default",
  used_at_most_recent = "used_at_most_recent",
  used_at_least_recent = "used_at_least_recent",
  a_z = "a_z",
  z_a = "z_a",
}

export const SourceUrlValidations = {
  min: SOURCE_URL_MIN_LENGTH,
  max: SOURCE_URL_MAX_LENGTH,
};

export const ArticleSearchValidations = {
  min: ARTICLE_SEARCH_QUERY_MIN_LENGTH,
  max: ARTICLE_SEARCH_QUERY_MAX_LENGTH,
};

export const ArticleUrlValidations = {
  min: 1,
  max: ARTICLE_URL_MAX_CHARS,
};

export enum ArchiveFilesSortEnum {
  default = "default",
  a_z = "a_z",
  z_a = "z_a",
}

export const BlacklistedTokenValidations = {
  min: SOURCE_URL_MIN_LENGTH,
  max: SOURCE_URL_MAX_LENGTH,
};
