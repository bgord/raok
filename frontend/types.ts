export type ArticleType = {
  id: string;
  url: string;
  status: string;
  source: string;
};

export type ArticlePayloadType = { url: ArticleType["url"] };

export type NewspaperType = {
  id: string;
  status: string;
  sentAt: number | null;
  scheduledAt: number;
  articles: ArticleType[];
};

export type StatsType = {
  createdArticles: number;
};
