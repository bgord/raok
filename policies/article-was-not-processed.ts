import * as bg from "@bgord/node";
import * as VO from "../value-objects";

class ArticleInProcessingError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ArticleInProcessingError.prototype);
  }
}

type ArticleWasNotProcessedConfigType = {
  entity: VO.ArticleType;
};

export class ArticleWasNotProcessedFactory extends bg.Policy<ArticleWasNotProcessedConfigType> {
  fails(config: ArticleWasNotProcessedConfigType) {
    return config.entity.status !== VO.ArticleStatusEnum.ready;
  }

  message = "article.not-processed.error";

  error = ArticleInProcessingError;
}

export const ArticleWasNotProcessed = new ArticleWasNotProcessedFactory();
