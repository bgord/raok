import * as bg from "@bgord/node";
import * as VO from "../value-objects";
import * as Aggregates from "../aggregates";

class ArticlesAreNotSendableError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ArticlesAreNotSendableError.prototype);
  }
}

type ArticlesAreSendableConfigType = {
  articles: Aggregates.Article[];
};

class ArticlesAreSendableFactory extends bg.Policy<ArticlesAreSendableConfigType> {
  fails(config: ArticlesAreSendableConfigType): boolean {
    return config.articles
      .map((article) => article.entity)
      .some((article) => article?.status !== VO.ArticleStatusEnum.ready);
  }

  message = "article.sending.error";

  error = ArticlesAreNotSendableError;
}

export const ArticlesAreSendable = new ArticlesAreSendableFactory();
