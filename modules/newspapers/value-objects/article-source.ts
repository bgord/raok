import { z } from "zod";

export enum ArticleSourceEnum {
  web = "web",
  feedly = "feedly",
  rss = "rss",
}

export const ArticleSource = z
  .nativeEnum(ArticleSourceEnum)
  .default(ArticleSourceEnum.web);
