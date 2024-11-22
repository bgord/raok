import type { Article } from "../infra/db";
import type * as bg from "@bgord/frontend";

import type { ArticleRepository } from "../modules/newspapers/repositories/article-repository";
import type { NewspaperRepository } from "../modules/newspapers/repositories/newspaper-repository";
import type { StatsRepository } from "../modules/stats/repositories/stats-repository";
import type { SourceRepository } from "../modules/rss/repositories/source-repository";
import type { TokenBlacklistRepository } from "../modules/recommendations/repositories/token-blacklist-repository";
import type { DeviceRepository } from "../modules/delivery/repositories/device-repository";

/** @public */
export type { HourType, EmailType } from "@bgord/node/dist/schema";
/** @public */
export type { ArticleSearchQueryType } from "../modules/newspapers/value-objects/article-search-query";

/** @public */
export enum ArticleSourceEnum {
  web = "web",
  feedly = "feedly",
  rss = "rss",
}

/** @public */
export enum NewspaperStatusEnum {
  delivered = "delivered",
  archived = "archived",
  error = "error",
}

export type ArticlePayloadType = Pick<Article, "url">;
export type ArticleType = Awaited<
  ReturnType<(typeof ArticleRepository)["pagedGetAllNonProcessed"]>
>["result"][number];

export type ArchiveArticleType = Awaited<
  ReturnType<(typeof ArticleRepository)["pagedGetAll"]>
>["result"][number];

export type NewspaperType = Awaited<
  ReturnType<(typeof NewspaperRepository)["getAllNonArchived"]>
>[number];

export type StatsType = Awaited<ReturnType<(typeof StatsRepository)["getAll"]>>;

export type ToastType = bg.BaseToastType & {
  articleId?: ArticleType["id"] | null;
  articleTitle?: ArticleType["title"] | null;
  revision?: ArticleType["revision"] | null;
};

export type SourceType = Awaited<
  ReturnType<(typeof SourceRepository)["listAll"]>
>[number];

export type TokenBlacklistType = Awaited<
  ReturnType<(typeof TokenBlacklistRepository)["list"]>
>[number];

export type DeviceType = Omit<
  Awaited<ReturnType<(typeof DeviceRepository)["list"]>>[number],
  "createdAt"
>;

import { SOURCE_URL_MIN_LENGTH } from "../modules/rss/value-objects/source-url-min-length";
import { SOURCE_URL_MAX_LENGTH } from "../modules/rss/value-objects/source-url-max-length";

export { MAX_UPLOADED_FILE_SIZE_BYTES } from "../modules/delivery/value-objects/max-uploaded-file-size";
export { FileMimeTypes } from "../modules/delivery/value-objects/file-mime-types";

export { NEWSPAPER_MAX_ARTICLES_NUMBER } from "../modules/newspapers/value-objects/newspaper-max-articles-number";

import { ARTICLE_SEARCH_QUERY_MIN_LENGTH } from "../modules/newspapers/value-objects/article-search-query-min-length";
import { ARTICLE_SEARCH_QUERY_MAX_LENGTH } from "../modules/newspapers/value-objects/article-search-query-max-length";
import { DEVICE_NAME_MAX_LENGTH } from "../modules/delivery/value-objects/device-name-max-length";

import { ARTICLE_URL_MAX_CHARS } from "../modules/newspapers/value-objects/article-url-max-chars";
export { ArticleStatusEnum } from "../modules/newspapers/value-objects/article-status-enum";

export { ArticleRatingLevel } from "../modules/newspapers/value-objects/article-rating-level-enum";

/** @public */
export { SUGGESTED_BLACKLISTED_TOKENS_COUNT } from "../modules/recommendations/value-objects/suggested-blacklisted-tokens-count";

export enum SourceSortEnum {
  default = "default",
  used_at_least_recent = "used_at_least_recent",
  most_frequent = "most_frequent",
  least_frequent = "least_frequent",
  a_z = "a_z",
  z_a = "z_a",
  most_quality = "most_quality",
  least_quality = "least_quality",
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

export const BlacklistedTokenValidations = {
  min: SOURCE_URL_MIN_LENGTH,
  max: SOURCE_URL_MAX_LENGTH,
};

export const DeviceNameValidations = {
  min: 1,
  max: DEVICE_NAME_MAX_LENGTH,
};

export enum ArticlesSortEnum {
  default = "default",
  most_rated = "most_rated",
  least_rated = "least_rated",
  longest_read = "longest_read",
  shortest_read = "shortest_read",
}
