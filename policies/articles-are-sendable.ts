import { Policy } from "@bgord/node";

import * as VO from "../value-objects";

class ArticlesAreNotSendableError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ArticlesAreNotSendableError.prototype);
  }
}

class ArticlesAreSendableFactory extends Policy {
  fails(articles: VO.ArticleType[]): boolean {
    return articles.some(
      (article) => article.status !== VO.ArticleStatusEnum.ready
    );
  }

  error = ArticlesAreNotSendableError;
}

export const ArticlesAreSendable = new ArticlesAreSendableFactory();
