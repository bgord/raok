import { Policy } from "@bgord/node";

import * as VO from "../value-objects";
import { Article } from "../aggregates/article";

class ArticlesAreNotSendableError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ArticlesAreNotSendableError.prototype);
  }
}

type ArticlesAreSendableConfigType = {
  articles: Article[];
};

class ArticlesAreSendableFactory extends Policy<ArticlesAreSendableConfigType> {
  fails(config: ArticlesAreSendableConfigType): boolean {
    return config.articles
      .map((article) => article.entity)
      .some((article) => article?.status !== VO.ArticleStatusEnum.ready);
  }

  error = ArticlesAreNotSendableError;
}

export const ArticlesAreSendable = new ArticlesAreSendableFactory();
