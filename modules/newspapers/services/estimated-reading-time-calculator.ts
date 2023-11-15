import * as bg from "@bgord/node";

import * as VO from "../value-objects";

export class ReadingTimeCalculator {
  private static WORDS_PER_MINUTE = 225;

  static getMinutes(
    content: VO.ArticleContentType
  ): VO.ArticleEstimatedReadingTimeInMinutesType {
    const words = content.split(" ").length;

    const minutes = new bg.RoundUp().round(
      words / ReadingTimeCalculator.WORDS_PER_MINUTE
    );

    return VO.ArticleEstimatedReadingTimeInMinutes.parse(minutes);
  }
}
