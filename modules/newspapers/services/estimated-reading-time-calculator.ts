import * as bg from "@bgord/node";
import * as VO from "../value-objects";

export class ReadingTimeCalculator {
  private static WORDS_PER_MINUTE = 225;

  static getMinutes(
    content: VO.ReadableArticleContentType
  ): VO.ReadableArticleReadingTimeType {
    const numberOfWords = content.split(" ").length;

    const minutes = new bg.RoundUp().round(
      numberOfWords / ReadingTimeCalculator.WORDS_PER_MINUTE
    );

    return VO.ReadableArticleReadingTime.parse(minutes);
  }
}
