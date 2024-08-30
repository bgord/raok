import { z } from "zod";

import { ARTICLE_DESCRIPTION_MAX_LENGTH } from "./article-description-max-length";

export const ArticleDescription = z
  .string()
  .trim()
  .transform((value) => value.substring(0, ARTICLE_DESCRIPTION_MAX_LENGTH))
  .optional();
