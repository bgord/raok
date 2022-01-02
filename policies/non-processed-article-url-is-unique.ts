import * as VO from "../value-objects";

import { ArticleRepository } from "../repositories/article-repository";

export class NonProcessedArticleUrlIsUnique {
  static async fails(articleUrl: VO.ArticleType["url"]): Promise<boolean> {
    const numbersOfNonProcessedArticlesWithUrl =
      await ArticleRepository.getNumbersOfNonProcessedArticlesWithUrl(
        articleUrl
      );

    return numbersOfNonProcessedArticlesWithUrl > 0;
  }
}

export class NonProcessedArticleUrlIsNotUniqueError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(
      this,
      NonProcessedArticleUrlIsNotUniqueError.prototype
    );
  }
}
