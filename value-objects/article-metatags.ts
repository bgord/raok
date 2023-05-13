import { z } from "zod";

import { ArticleTitle } from "./article-title";

export const ArticleMetatags = z.object({ title: ArticleTitle });

export type ArticleMetatagsType = z.infer<typeof ArticleMetatags>;

export class ArticleNotFoundError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ArticleNotFoundError.prototype);
  }
}

export class ArticleIsNotHTML extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ArticleIsNotHTML.prototype);
  }
}
