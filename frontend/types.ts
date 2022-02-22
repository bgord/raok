import type { Article } from "@prisma/client";

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
export type ArticleType = Pick<Article, "id" | "url" | "title" | "source">;

export type ArchiveArticleType = Pick<
  Article,
  "id" | "url" | "title" | "createdAt" | "favourite" | "status" | "source"
>;

export type FavouriteArticleType = Pick<Article, "id" | "url" | "title">;

export type NewspaperArticleType = Pick<
  Article,
  "id" | "url" | "title" | "favourite" | "status" | "source"
>;

export type NewspaperType = {
  id: string;
  title: string;
  status: string;
  sentAt: {
    raw: number;
    formatted: string | null;
  };
  scheduledAt: number;
  duration: string;
  articles: NewspaperArticleType[];
};

export type StatsType = {
  createdArticles: number;
  sentNewspapers: number;
  lastFeedlyImport: string | null;
};

type Hour = {
  value: number;
  label: string;
};

export type SettingsType = {
  hours: Hour[];
  articlesToReviewNotificationHour: Hour;
  isArticlesToReviewNotificationEnabled: boolean;
};
