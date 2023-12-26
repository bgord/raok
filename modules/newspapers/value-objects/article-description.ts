import { z } from "zod";

import { ARTICLE_DESCRIPTION_MAX_LENGTH } from "./article-description-max-length";

export const ArticleDescription = z
  .string()
  .trim()
  .max(ARTICLE_DESCRIPTION_MAX_LENGTH)
  .optional();
