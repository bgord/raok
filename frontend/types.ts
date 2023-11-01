import type { Article } from "../infra/db";
import type { AsyncReturnType } from "@bgord/node";
import type * as bg from "@bgord/frontend";

import type { ArticleRepository } from "../repositories/article-repository";
import type { NewspaperRepository } from "../repositories/newspaper-repository";
import type { StatsRepository } from "../modules/stats/repositories/stats-repository";
import type { SettingsRepository } from "../modules/settings/repositories/settings-repository";
import type { FilesRepository } from "../repositories/files-repository";
import type { SourceRepository } from "../modules/rss/repositories/source-repository";

export type { HourType } from "@bgord/node/dist/schema";
export type { ArticleSearchQueryType } from "../value-objects/article-search-query";

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
  typeof ArticleRepository["getAll"]
>[0];

export type NewspaperType = AsyncReturnType<
  typeof NewspaperRepository["getAllNonArchived"]
>[0];

export type StatsType = AsyncReturnType<typeof StatsRepository["getAll"]>;
export type SettingsType = AsyncReturnType<typeof SettingsRepository["getAll"]>;

export type ToastType = bg.BaseToastType & {
  articleId?: ArticleType["id"] | null;
  articleTitle?: ArticleType["title"] | null;
};

export type ArchiveFileType = AsyncReturnType<
  typeof FilesRepository["getAll"]
>[0];

export type SourceType = AsyncReturnType<typeof SourceRepository["listAll"]>[0];

export { SourceStatusEnum } from "../modules/rss/value-objects/source-status-enum";
export { SOURCE_URL_MIN_LENGTH } from "../modules/rss/value-objects/source-url-min-length";
export { SOURCE_URL_MAX_LENGTH } from "../modules/rss/value-objects/source-url-max-length";
