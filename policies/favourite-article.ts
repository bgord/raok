import { Policy } from "@bgord/node";

import * as VO from "../value-objects";

class FavouriteArticleError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, FavouriteArticleError.prototype);
  }
}

type FavouriteArticleConfigType = {
  entity: VO.ArticleType;
};

class FavouriteArticleFactory extends Policy<FavouriteArticleConfigType> {
  fails(config: FavouriteArticleConfigType) {
    return (
      config.entity.status !== VO.ArticleStatusEnum.processed ||
      config.entity.favourite
    );
  }

  error = FavouriteArticleError;
}

export const FavouriteArticle = new FavouriteArticleFactory();
