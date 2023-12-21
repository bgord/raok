import { TokenType } from "./token";
import { TokenRatingValueType } from "./token-rating-value";

export type TokenRatingType = {
  token: TokenType;
  value: TokenRatingValueType;
};
