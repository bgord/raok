import { Policy } from "@bgord/node";

import * as VO from "../value-objects";

import { ArticleRepository } from "../repositories/article-repository";

class ArticleUrlIsNotUniqueError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ArticleUrlIsNotUniqueError.prototype);
  }
}

type ArticleUrlIsUniqueConfigType = {
  articleUrl: VO.ArticleType["url"];
};

class ArticleUrlIsUniqueFactory extends Policy<ArticleUrlIsUniqueConfigType> {
  async fails(config: ArticleUrlIsUniqueConfigType) {
    const numbersOfArticlesWithUrl =
      await ArticleRepository.getNumbersOfArticlesWithUrl(config.articleUrl);

    return numbersOfArticlesWithUrl > 0;
  }

  error = ArticleUrlIsNotUniqueError;
}

export const ArticleUrlIsUnique = new ArticleUrlIsUniqueFactory();
