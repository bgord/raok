import { Policy } from "@bgord/node";

import * as VO from "../value-objects";

class TooManyArticlesInNewspaperError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, TooManyArticlesInNewspaperError.prototype);
  }
}

class MaximumNewspaperArticleNumberFactory extends Policy {
  async fails(config: { articles: VO.NewspaperType["articles"]; max: number }) {
    return config.articles.length > config.max;
  }

  error = TooManyArticlesInNewspaperError;
}

export const MaximumNewspaperArticleNumber =
  new MaximumNewspaperArticleNumberFactory();
