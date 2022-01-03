import * as VO from "../value-objects";

export class ReadingTimeCalculator {
  static WORDS_PER_MINUTE = 225;

  static getMinutes(
    content: VO.ReadableArticleContentType
  ): VO.ReadableArticleReadingTimeType {
    const numberOfWords = content.split(" ").length;

    const minutes = Math.ceil(
      numberOfWords / ReadingTimeCalculator.WORDS_PER_MINUTE
    );

    return VO.ReadableArticleReadingTime.parse(minutes);
  }
}
