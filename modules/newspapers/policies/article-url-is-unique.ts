import * as bg from "@bgord/node";
import * as VO from "../value-objects";
import * as Repos from "../repositories";

class ArticleUrlIsNotUniqueError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ArticleUrlIsNotUniqueError.prototype);
  }
}

type ArticleUrlIsUniqueConfigType = Pick<VO.ArticleType, "url">;

class ArticleUrlIsUniqueFactory extends bg.Policy<ArticleUrlIsUniqueConfigType> {
  async fails(config: ArticleUrlIsUniqueConfigType): Promise<boolean> {
    const numbersOfArticlesWithUrl =
      await Repos.ArticleRepository.getNumbersOfArticlesWithUrl(config.url);

    return numbersOfArticlesWithUrl > 0;
  }

  message = "article.error.not_unique";

  error = ArticleUrlIsNotUniqueError;
}

export const ArticleUrlIsUnique = new ArticleUrlIsUniqueFactory();
