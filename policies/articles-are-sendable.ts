import * as VO from "../value-objects";

export class ArticlesAreSendable {
  static fails(articles: VO.ArticleType[]): boolean {
    return articles.some(
      (article) => article.status !== VO.ArticleStatusEnum.ready
    );
  }
}

export class ArticlesAreNotSendableError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ArticlesAreNotSendableError.prototype);
  }
}
