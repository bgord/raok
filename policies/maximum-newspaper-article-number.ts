import { Policy } from "@bgord/node";

import * as VO from "../value-objects";

class TooManyArticlesInNewspaperError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, TooManyArticlesInNewspaperError.prototype);
  }
}
type MaximumNewspaperArticleNumberConfigType = {
  articles: VO.NewspaperType["articles"];
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
