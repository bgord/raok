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

class NonProcessedArticleUrlIsUniqueFactory extends Policy {
  async fails(articleUrl: VO.ArticleType["url"]): Promise<boolean> {
    const numbersOfNonProcessedArticlesWithUrl =
      await ArticleRepository.getNumbersOfNonProcessedArticlesWithUrl(
        articleUrl
      );

    return numbersOfNonProcessedArticlesWithUrl > 0;
  }

  error = NonProcessedArticleUrlIsNotUniqueError;
}

export const NonProcessedArticleUrlIsUnique =
  new NonProcessedArticleUrlIsUniqueFactory();
