import * as bg from "@bgord/node";
import * as Aggregates from "../aggregates";

class EmptyNewspaperError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, EmptyNewspaperError.prototype);
  }
}
type NoEmptyNewspaperConfigType = {
  articles: Aggregates.Article[];
};

class NoEmptyNewspaperFactory extends bg.Policy<NoEmptyNewspaperConfigType> {
  async fails(config: NoEmptyNewspaperConfigType) {
    return config.articles.length === 0;
  }

  message = "newspaper.empty.error";

  error = EmptyNewspaperError;
}

export const NoEmptyNewspaper = new NoEmptyNewspaperFactory();
