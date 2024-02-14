import * as VO from "../value-objects";

export class ArticleRatingLevelCalculator {
  static calculate(rating: VO.ArticleRatingType): VO.ArticleRatingLevel {
    if (rating === undefined || rating === null) {
      return VO.ArticleRatingLevel.unknown;
    }
    if (rating < 0) return VO.ArticleRatingLevel.not_recommended;
    if (rating >= 0 && rating <= 3) return VO.ArticleRatingLevel.default;
    return VO.ArticleRatingLevel.recommended;
  }
}
