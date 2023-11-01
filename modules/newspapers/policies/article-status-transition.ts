import * as bg from "@bgord/node";
import * as VO from "../value-objects";

class InvalidArticleStatusTransition extends Error {
  constructor(config: ArticleStatusTransitionConfigType) {
    super();
    Object.setPrototypeOf(this, InvalidArticleStatusTransition.prototype);
    this.message = `Invalid Article status transition: from ${config.from} to ${config.to}`;
  }
}
type ArticleStatusTransitionConfigType = {
  from: VO.ArticleStatusType;
  to: VO.ArticleStatusType;
};

class ArticleStatusTransitionFactory extends bg.Policy<ArticleStatusTransitionConfigType> {
  async fails(config: ArticleStatusTransitionConfigType) {
    const status = VO.ArticleStatusEnum;

    const transitions: Record<VO.ArticleStatusType, VO.ArticleStatusType[]> = {
      [status.ready]: [status.in_progress, status.deleted],
      [status.in_progress]: [status.processed, status.ready],
      [status.processed]: [status.in_progress],
      [status.deleted]: [status.ready],
    };

    return !transitions[config.from].includes(config.to);
  }

  message = "article.status.transition.error";

  error = InvalidArticleStatusTransition;

  async perform(config: ArticleStatusTransitionConfigType) {
    if (await this.fails(config)) {
      throw new this.error(config);
    }
  }
}

export const ArticleStatusTransition = new ArticleStatusTransitionFactory();
