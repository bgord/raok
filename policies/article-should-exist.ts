import * as VO from "../value-objects";

import { ArticleRepository } from "../repositories/article-repository";

export class ArticleShouldExist {
  static async fails(articleId: VO.ArticleType["id"]): Promise<boolean> {
    const numbersOfArticlesWithId =
      await ArticleRepository.getNumbersOfArticlesWithId(articleId);

    return numbersOfArticlesWithId < 1;
  }
}

export class ArticleDoesNotExistError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ArticleDoesNotExistError.prototype);
  }
}
