import { z } from "zod";

import { ArticleTitle } from "./article-title";
import { ArticleDescription } from "./article-description";

export const ArticleMetatags = z.object({
  title: ArticleTitle,
  description: ArticleDescription,
});

export type ArticleMetatagsType = z.infer<typeof ArticleMetatags>;
