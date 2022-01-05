import { Policy } from "@bgord/node";

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

class ArticleStatusTransitionFactory extends Policy<ArticleStatusTransitionConfigType> {
  async fails(config: ArticleStatusTransitionConfigType) {
    const enums = VO.ArticleStatusEnum;

    const transitions: Record<VO.ArticleStatusType, VO.ArticleStatusType[]> = {
      [enums.ready]: [enums.in_progress],
      [enums.in_progress]: [enums.processed],
      [enums.processed]: [enums.in_progress],
    };

    return !transitions[config.from].includes(config.to);
  }

  error = InvalidArticleStatusTransition;

  async perform(config: ArticleStatusTransitionConfigType) {
    if (await this.fails(config)) {
      throw new this.error(config);
    }
  }
}

export const ArticleStatusTransition = new ArticleStatusTransitionFactory();
