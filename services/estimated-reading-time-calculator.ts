import * as VO from "../value-objects";

export class ReadingTimeCalculator {
  static WORDS_PER_MINUTE = 225;

  static calculateMinutes(
    content: VO.ReadableArticleContentType
  ): VO.ReadableArticleReadingTimeType {
    const numberOfWords = content.split(" ").length;

    return Math.ceil(numberOfWords / ReadingTimeCalculator.WORDS_PER_MINUTE);
  }
}
