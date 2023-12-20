import { TokenType } from "./tokenizer";

enum RatingActionEnum {
  opened = "opened",
  read = "read",
  processed = "processed",
  deleted = "deleted",
}

type TokenRatingValue = number;

export type TokenRatingType = { token: TokenType; value: TokenRatingValue };

export class TokenRatingCalculator {
  static calculate(
    action: RatingActionEnum,
    tokens: TokenType[]
  ): TokenRatingType[] {
    switch (action) {
      case RatingActionEnum.opened:
        return tokens.map((token) => ({ token, value: 1 }));
      case RatingActionEnum.read:
        return tokens.map((token) => ({ token, value: 2 }));
      case RatingActionEnum.processed:
        return tokens.map((token) => ({ token, value: 5 }));
      case RatingActionEnum.deleted:
        return tokens.map((token) => ({ token, value: -0.5 }));
      default:
        return [];
    }
  }
}
