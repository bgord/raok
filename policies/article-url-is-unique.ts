import * as VO from "../value-objects";

export class ArticleUrlIsUnique {
  static fails(
    articles: VO.ArticleType[],
    articleUrl: VO.ArticleType["url"]
  ): boolean {
    return Boolean(articles.some((article) => article.url === articleUrl));
  }
}

export class ArticleUrlIsNotUniqueError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ArticleUrlIsNotUniqueError.prototype);
  }
}
