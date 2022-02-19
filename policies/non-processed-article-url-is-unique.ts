import { Policy } from "@bgord/node";

import * as VO from "../value-objects";
import * as Repos from "../repositories";

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
      await Repos.ArticleRepository.getNumbersOfNonProcessedArticlesWithUrl(
        config.articleUrl
      );

    return numbersOfNonProcessedArticlesWithUrl > 0;
  }

  error = NonProcessedArticleUrlIsNotUniqueError;
}

export const NonProcessedArticleUrlIsUnique =
  new NonProcessedArticleUrlIsUniqueFactory();
