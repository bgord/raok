import { Policy } from "@bgord/node";

import { Article } from "../aggregates/article";

class TooManyArticlesInNewspaperError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, TooManyArticlesInNewspaperError.prototype);
  }
}
type MaximumNewspaperArticleNumberConfigType = {
  articles: Article[];
  max: number;
};

class MaximumNewspaperArticleNumberFactory extends Policy<MaximumNewspaperArticleNumberConfigType> {
  async fails(config: MaximumNewspaperArticleNumberConfigType) {
    return config.articles.length > config.max;
  }

  error = TooManyArticlesInNewspaperError;
}

export const MaximumNewspaperArticleNumber =
  new MaximumNewspaperArticleNumberFactory();
