import { Policy } from "@bgord/node";

import * as VO from "../value-objects";

class ArticlesAreNotSendableError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ArticlesAreNotSendableError.prototype);
  }
}

type ArticlesAreSendableConfigType = {
  articles: VO.ArticleType[];
};

class ArticlesAreSendableFactory extends Policy<ArticlesAreSendableConfigType> {
  fails(config: ArticlesAreSendableConfigType): boolean {
    return config.articles.some(
      (article) => article.status !== VO.ArticleStatusEnum.ready
    );
  }

  error = ArticlesAreNotSendableError;
}

export const ArticlesAreSendable = new ArticlesAreSendableFactory();
