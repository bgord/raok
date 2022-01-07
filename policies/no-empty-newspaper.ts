import { Policy } from "@bgord/node";

import { Article } from "../aggregates/article";

class EmptyNewspaperError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, EmptyNewspaperError.prototype);
  }
}
type NoEmptyNewspaperConfigType = {
  articles: Article[];
};

class NoEmptyNewspaperFactory extends Policy<NoEmptyNewspaperConfigType> {
  async fails(config: NoEmptyNewspaperConfigType) {
    return config.articles.length === 0;
  }

  error = EmptyNewspaperError;
}

export const NoEmptyNewspaper = new NoEmptyNewspaperFactory();
