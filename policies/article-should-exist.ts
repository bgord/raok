import * as VO from "../value-objects";

export class ArticleShouldExist {
  static fails(
    articles: VO.ArticleType[],
    articleId: VO.ArticleType["id"]
  ): boolean {
    return Boolean(articles.some((article) => article.id === articleId));
  }
}

export class ArticleDoesNotExistError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ArticleDoesNotExistError.prototype);
  }
}
