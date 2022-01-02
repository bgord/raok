import { Policy } from "@bgord/node";

import * as VO from "../value-objects";

class ArticleInProcessingError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ArticleInProcessingError.prototype);
  }
}

export class ArticleWasNotProcessedFactory extends Policy {
  fails(entity: VO.ArticleType) {
    return entity.status !== VO.ArticleStatusEnum.ready;
  }

  error = ArticleInProcessingError;
}

export const ArticleWasNotProcessed = new ArticleWasNotProcessedFactory();
