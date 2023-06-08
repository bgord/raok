import type { Article } from "../infra/db";
import type { AsyncReturnType } from "@bgord/node";
import type * as bg from "@bgord/frontend";

import type { ArticleRepository } from "../repositories/article-repository";
import type { NewspaperRepository } from "../repositories/newspaper-repository";
import type { StatsRepository } from "../repositories/stats-repository";
import type { SettingsRepository } from "../repositories/settings-repository";
import type { FilesRepository } from "../repositories/files-repository";

export type { ArticleSearchQueryType } from "../value-objects/article-search-query";
export type { HourType } from "../value-objects/hour";

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
