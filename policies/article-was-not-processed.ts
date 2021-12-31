import * as VO from "../value-objects";

export class ArticleWasNotProcessed {
  static fails(entity: VO.ArticleType): boolean {
    return entity.status === VO.ArticleStatusEnum.ready;
  }
}

export class ArticleInProcessingError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ArticleInProcessingError.prototype);
  }
}
