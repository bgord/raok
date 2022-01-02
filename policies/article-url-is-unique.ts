import { Policy } from "@bgord/node";

import * as VO from "../value-objects";

import { ArticleRepository } from "../repositories/article-repository";

class ArticleUrlIsNotUniqueError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ArticleUrlIsNotUniqueError.prototype);
  }
}

class ArticleUrlIsUniqueFactory extends Policy {
  async fails(articleUrl: VO.ArticleType["url"]) {
    const numbersOfArticlesWithUrl =
      await ArticleRepository.getNumbersOfArticlesWithUrl(articleUrl);

    return numbersOfArticlesWithUrl > 0;
  }

  error = ArticleUrlIsNotUniqueError;
}

export const ArticleUrlIsUnique = new ArticleUrlIsUniqueFactory();
