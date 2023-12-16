/* eslint-ignore */
import { z } from "zod";

import { ArticleStatusEnum } from "./article-status-enum";

export const ArticleStatus = z
  .nativeEnum(ArticleStatusEnum)
  .default(ArticleStatusEnum.ready);

export type ArticleStatusType = z.infer<typeof ArticleStatus>;
