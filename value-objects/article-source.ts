import { z } from "zod";

/* eslint-disable no-shadow */
export enum ArticleSourceEnum {
  /* eslint-disable no-unused-vars */
  web = "web",
  feedly = "feedly",
}

export const ArticleSource = z
  .nativeEnum(ArticleSourceEnum)
  .default(ArticleSourceEnum.web);

export type ArticleSourceType = z.infer<typeof ArticleSource>;
