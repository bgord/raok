import type { Article } from "@prisma/client";
import type { AsyncReturnType } from "@bgord/node";
import type { BaseToastType } from "@bgord/frontend";

import type { ArticleRepository } from "../repositories/article-repository";
import type { NewspaperRepository } from "../repositories/newspaper-repository";
import type { StatsRepository } from "../repositories/stats-repository";
import type { SettingsRepository } from "../repositories/settings-repository";

export enum ArticleSourceEnum {
  web = "web",
  feedly = "feedly",
}

export enum ArticleStatusEnum {
  "ready" = "ready",
  "in_progress" = "in_progress",
  "processed" = "processed",
}

export enum NewspaperStatusEnum {
  "delivered" = "delivered",
  "archived" = "archived",
  "error" = "error",
}

export type ArticlePayloadType = Pick<Article, "url">;
export type ArticleType = AsyncReturnType<
  typeof ArticleRepository["getAllNonProcessed"]
>[0];

export type ArchiveArticleType = AsyncReturnType<
  typeof ArticleRepository["getAll"]
>[0];

export type FavouriteArticleType = AsyncReturnType<
  typeof ArticleRepository["getFavourite"]
>[0];

export type NewspaperType = AsyncReturnType<
  typeof NewspaperRepository["getAllNonArchived"]
>[0];

export type StatsType = AsyncReturnType<typeof StatsRepository["getAll"]>;
export type SettingsType = AsyncReturnType<typeof SettingsRepository["getAll"]>;

export type ToastType = BaseToastType & {
  articleId?: ArticleType["id"] | null;
};
