import { Policy } from "@bgord/node";

import * as VO from "../value-objects";

import { ArticleRepository } from "../repositories/article-repository";

class NonProcessedArticleUrlIsNotUniqueError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(
      this,
      NonProcessedArticleUrlIsNotUniqueError.prototype
    );
  }
}

type NonProcessedArticleUrlIsUniqueConfigType = {
  articleUrl: VO.ArticleType["url"];
};

class NonProcessedArticleUrlIsUniqueFactory extends Policy<NonProcessedArticleUrlIsUniqueConfigType> {
  async fails(
    config: NonProcessedArticleUrlIsUniqueConfigType
  ): Promise<boolean> {
    const numbersOfNonProcessedArticlesWithUrl =
      await ArticleRepository.getNumbersOfNonProcessedArticlesWithUrl(
        config.articleUrl
      );

    return numbersOfNonProcessedArticlesWithUrl > 0;
  }

  error = NonProcessedArticleUrlIsNotUniqueError;
}

export const NonProcessedArticleUrlIsUnique =
  new NonProcessedArticleUrlIsUniqueFactory();
