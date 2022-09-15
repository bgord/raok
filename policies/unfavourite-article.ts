import * as bg from "@bgord/node";
import * as VO from "../value-objects";

class UnfavouriteArticleError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, UnfavouriteArticleError.prototype);
  }
}

type UnfavouriteArticleConfigType = {
  entity: VO.ArticleType;
};

class UnfavouriteArticleFactory extends bg.Policy<UnfavouriteArticleConfigType> {
  fails(config: UnfavouriteArticleConfigType) {
    return (
      !config.entity.favourite ||
      config.entity.status !== VO.ArticleStatusEnum.processed
    );
  }

  error = UnfavouriteArticleError;
}

export const UnfavouriteArticle = new UnfavouriteArticleFactory();
