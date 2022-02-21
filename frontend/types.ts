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

export type ArticleType = {
  id: string;
  url: string;
  status: string;
  source: string;
  title: string;
  description: string;
  favourite: boolean;
  createdAt: number;
};

export type ArticlePayloadType = { url: ArticleType["url"] };

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
  articles: ArticleType[];
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
