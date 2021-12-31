import * as VO from "../value-objects";

import { ArticleRepository } from "../repositories/article-repository";

export class ArticleUrlIsUnique {
  static async fails(articleUrl: VO.ArticleType["url"]): Promise<boolean> {
    const numbersOfArticlesWithUrl =
      await ArticleRepository.getNumbersOfArticlesWithUrl(articleUrl);

    return numbersOfArticlesWithUrl > 0;
  }
}

export class ArticleUrlIsNotUniqueError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ArticleUrlIsNotUniqueError.prototype);
  }
}
