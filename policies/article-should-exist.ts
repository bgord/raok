import * as VO from "../value-objects";

export class ArticleShouldExist {
  static fails(entity: VO.ArticleType | null): boolean {
    return entity === null;
  }
}

export class ArticleDoesNotExistError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ArticleDoesNotExistError.prototype);
  }
}
