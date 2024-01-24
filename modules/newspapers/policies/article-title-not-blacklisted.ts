import * as bg from "@bgord/node";

import * as VO from "../value-objects";

import * as Recommendations from "../../recommendations";

/** @public */
export class ArticleBlacklistedError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ArticleBlacklistedError.prototype);
  }
}

type ArticleTitleNotBlacklistedConfigType = Pick<
  VO.ReadableArticleType,
  "title"
>;

class ArticleTitleNotBlacklistedFactory extends bg.Policy<ArticleTitleNotBlacklistedConfigType> {
  async fails(config: ArticleTitleNotBlacklistedConfigType): Promise<boolean> {
    const tokenBlacklist = (
      await Recommendations.Repos.TokenBlacklistRepository.list()
    ).map((item) => item.token);

    const tokens = Recommendations.Services.Tokenizer.tokenize(config.title);

    if (!tokens.length) return false;

    return tokens.some((token) => tokenBlacklist.includes(token));
  }

  message = "article.title.blacklisted";

  error = ArticleBlacklistedError;
}

export const ArticleTitleNotBlacklisted =
  new ArticleTitleNotBlacklistedFactory();
