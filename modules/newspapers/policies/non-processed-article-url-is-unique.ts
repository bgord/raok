import * as bg from "@bgord/node";
import * as VO from "../value-objects";
import * as Repos from "../repositories";

export class NonProcessedArticleUrlIsNotUniqueError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(
      this,
      NonProcessedArticleUrlIsNotUniqueError.prototype
    );
  }
}

type NonProcessedArticleUrlIsUniqueConfigType = Pick<VO.ArticleType, "url">;

class NonProcessedArticleUrlIsUniqueFactory extends bg.Policy<NonProcessedArticleUrlIsUniqueConfigType> {
  async fails(
    config: NonProcessedArticleUrlIsUniqueConfigType
  ): Promise<boolean> {
    const numbersOfNonProcessedArticlesWithUrl =
      await Repos.ArticleRepository.getNumbersOfNonProcessedArticlesWithUrl(
        config.url
      );

    return numbersOfNonProcessedArticlesWithUrl > 0;
  }

  message = "article.error.not_unique";

  error = NonProcessedArticleUrlIsNotUniqueError;
}

export const NonProcessedArticleUrlIsUnique =
  new NonProcessedArticleUrlIsUniqueFactory();
