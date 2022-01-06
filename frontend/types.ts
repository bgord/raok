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
  number: string;
  sentAt: number;
  scheduledAt: number;
  articles: ArticleType[];
};
