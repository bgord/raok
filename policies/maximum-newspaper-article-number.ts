import * as bg from "@bgord/node";

import * as Aggregates from "../aggregates";

export class TooManyArticlesInNewspaperError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, TooManyArticlesInNewspaperError.prototype);
  }
}
type MaximumNewspaperArticleNumberConfigType = {
  articles: Aggregates.Article[];
  max: number;
};

class MaximumNewspaperArticleNumberFactory extends bg.Policy<MaximumNewspaperArticleNumberConfigType> {
  async fails(config: MaximumNewspaperArticleNumberConfigType) {
    return config.articles.length > config.max;
  }

  error = TooManyArticlesInNewspaperError;
}

export const MaximumNewspaperArticleNumber =
  new MaximumNewspaperArticleNumberFactory();
