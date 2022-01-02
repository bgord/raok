import * as VO from "../value-objects";

export class EstimatedReadingTimeCalculator {
  static WORDS_PER_MINUTE = 225;

  static calculateMinutes(
    content: VO.ArticleContentType
  ): VO.ReadableArticleReadingTimeType {
    const numberOfWords = content.split(" ").length;

    return Math.ceil(
      numberOfWords / EstimatedReadingTimeCalculator.WORDS_PER_MINUTE
    );
  }
}
