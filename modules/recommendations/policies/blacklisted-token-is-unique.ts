import * as bg from "@bgord/node";

import * as VO from "../value-objects";
import * as Repos from "../repositories";

export class BlacklistedTokenIsNotUniqueError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, BlacklistedTokenIsNotUniqueError.prototype);
  }
}

type BlacklistedTokenIsUniqueConfigType = { token: VO.TokenType };

class BlacklistedTokenIsUniqueFactory extends bg.Policy<BlacklistedTokenIsUniqueConfigType> {
  async fails(config: BlacklistedTokenIsUniqueConfigType): Promise<boolean> {
    const countOfTokens = await Repos.TokenBlacklistRepository.getCountOfToken(
      config
    );

    return countOfTokens > 0;
  }

  message = "blacklisted_token.error.not_unique";

  error = BlacklistedTokenIsNotUniqueError;
}

export const BlacklistedTokenIsUnique = new BlacklistedTokenIsUniqueFactory();
