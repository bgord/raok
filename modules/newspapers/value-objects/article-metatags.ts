import { z } from "zod";

import { ArticleTitle } from "./article-title";
import { ArticleDescription } from "./article-description";

export const ArticleMetatags = z.object({
  title: ArticleTitle,
  description: ArticleDescription,
});

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

export class ArticleScrapingTimeoutError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ArticleScrapingTimeoutError.prototype);
  }
}
