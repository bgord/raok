import { ArticleIdType } from "../../newspapers/value-objects/article-id";
import { ArticleRepository } from "../../newspapers/repositories/article-repository";

import * as Services from "../services";
import * as Repos from "../repositories";

export class RatingUpdateProcessor {
  static async process(id: ArticleIdType, action: Services.RatingActionEnum) {
    const article = await ArticleRepository.getSingle(id);

    if (!article?.title) return;

    const tokenRatings = Services.TokenRatingCalculator.calculate(
      action,
      Services.Tokenizer.tokenize(article.title)
    );

    for (const tokenRating of tokenRatings) {
      await Repos.TokenRatingRepository.upsert(tokenRating);
    }
  }
}
