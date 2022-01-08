import { z } from "zod";

import { ArticleTitle } from "./article-title";
import { ArticleDescription } from "./article-description";
import { ArticleImage } from "./article-image";

export const ArticleMetatags = z.object({
  title: ArticleTitle,
  description: ArticleDescription,
  image: ArticleImage,
});

export type ArticleMetatagsType = z.infer<typeof ArticleMetatags>;
