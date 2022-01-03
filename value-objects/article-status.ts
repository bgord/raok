/* eslint-ignore */

import { z } from "zod";

export enum ArticleStatusEnum {
  "ready" = "ready",
  "in_progress" = "in_progress",
  "processed" = "processed",
}

export const ArticleStatus = z
  .nativeEnum(ArticleStatusEnum)
  .default(ArticleStatusEnum.ready);

export type ArticleStatusType = z.infer<typeof ArticleStatus>;
