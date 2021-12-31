import { z } from "zod";

/* eslint-disable no-shadow */
export enum ArticleStatusEnum {
  /* eslint-disable no-unused-vars */
  "ready" = "ready",
  "in_progress" = "in_progress",
  "processed" = "processed",
}

export const ArticleStatus = z
  .nativeEnum(ArticleStatusEnum)
  .default(ArticleStatusEnum.ready);

export type ArticleStatusType = z.infer<typeof ArticleStatus>;
