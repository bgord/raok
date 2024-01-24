import * as bg from "@bgord/node";
import _ from "lodash";

import * as Repos from "../repositories";
import * as VO from "../value-objects";
import * as Services from "../services";

/** @public */
export class TextRatingCalculator {
  static async calculate(
    text: bg.Falsy<string>,
  ): Promise<VO.TokenRatingValueType | undefined> {
    if (!text) return undefined;

    const tokens = Services.Tokenizer.tokenize(text);

    try {
      const tokenRatings = await Repos.TokenRatingRepository.list(tokens);

      return tokenRatings
        .map((tokenRating) => tokenRating.value)
        .reduce(_.add, 0);
    } catch (error) {
      return undefined;
    }
  }
}
