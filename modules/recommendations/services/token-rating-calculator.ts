import * as VO from "../value-objects";

export enum RatingActionEnum {
  added = "added",
  opened = "opened",
  read = "read",
  processed = "processed",
  deleted = "deleted",
}

export class TokenRatingCalculator {
  static calculate(
    action: RatingActionEnum,
    tokens: VO.TokenType[],
  ): Omit<VO.TokenRatingType, "dismissedUntil">[] {
    switch (action) {
      case RatingActionEnum.added:
        return tokens.map((token) => ({ token, value: 2 }));
      case RatingActionEnum.opened:
        return tokens.map((token) => ({ token, value: 1 }));
      case RatingActionEnum.read:
        return tokens.map((token) => ({ token, value: 2 }));
      case RatingActionEnum.processed:
        return tokens.map((token) => ({ token, value: 5 }));
      case RatingActionEnum.deleted:
        return tokens.map((token) => ({ token, value: -1 }));
      default:
        return [];
    }
  }
}
