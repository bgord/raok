import { Policy } from "@bgord/node";

import * as VO from "../value-objects";

class ArticleDoesNotExistError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ArticleDoesNotExistError.prototype);
  }
}

type ArticleShouldExistConfigType = {
  entity: VO.ArticleType | null;
};

class ArticleShouldExistFactory extends Policy<ArticleShouldExistConfigType> {
  fails(config: ArticleShouldExistConfigType) {
    return config.entity === null;
  }

  error = ArticleDoesNotExistError;
}

export const ArticleShouldExist = new ArticleShouldExistFactory();
