import { z } from "zod";

import { ArticleTitle } from "./article-title";

export const ArticleMetatags = z.object({ title: ArticleTitle });

export type ArticleMetatagsType = z.infer<typeof ArticleMetatags>;
