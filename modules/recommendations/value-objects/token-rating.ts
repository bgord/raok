import * as bg from "@bgord/node";

import { TokenType } from "./token";
import { TokenRatingValueType } from "./token-rating-value";

export type TokenRatingType = {
  token: TokenType;
  value: TokenRatingValueType;
  dismissedUntil: bg.Schema.TimestampType | null;
};
