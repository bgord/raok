import * as bg from "@bgord/node";

import * as Repos from "../repositories";
import * as VO from "../value-objects";

export class SuggestedBlacklistedToken {
  private constructor(
    private readonly token: VO.TokenRatingType["token"],
    private readonly dismissedUntil: VO.TokenRatingType["dismissedUntil"],
  ) {}

  static async build(token: VO.TokenType) {
    const suggestedBlacklistedToken =
      await Repos.TokenRatingRepository.get(token);

    if (!suggestedBlacklistedToken)
      throw new Error("Suggested blacklisted token not found");

    return new SuggestedBlacklistedToken(
      token,
      suggestedBlacklistedToken.dismissedUntil,
    );
  }

  public async dismiss(until: bg.Schema.TimestampType) {
    if (this.dismissedUntil && this.dismissedUntil >= until) {
      throw new Error("Suggested blacklisted token already dismissed");
    }

    await Repos.TokenRatingRepository.dismiss(this.token, until);
  }
}
