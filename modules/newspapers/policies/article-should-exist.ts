import * as bg from "@bgord/node";
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

class ArticleShouldExistFactory extends bg.Policy<ArticleShouldExistConfigType> {
  fails(config: ArticleShouldExistConfigType) {
    return config.entity === null;
  }

  message = "article.exists.error";

  error = ArticleDoesNotExistError;
}

export const ArticleShouldExist = new ArticleShouldExistFactory();
