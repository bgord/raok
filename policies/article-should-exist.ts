import { Policy } from "@bgord/node";

import * as VO from "../value-objects";

class ArticleDoesNotExistError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ArticleDoesNotExistError.prototype);
  }
}

class ArticleShouldExistFactory extends Policy {
  fails(entity: VO.ArticleType | null) {
    return entity === null;
  }

  error = ArticleDoesNotExistError;
}

export const ArticleShouldExist = new ArticleShouldExistFactory();
