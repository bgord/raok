import * as bg from "@bgord/node";

import * as VO from "../value-objects";

import * as infra from "../../../infra";

export class TokenBlacklistRepository {
  static async create(payload: VO.BlacklistedTokenType) {
    const now = Date.now();

    await infra.db.tokenBlacklist.create({
      data: { token: payload.token, createdAt: now },
    });
  }

  static async delete(where: Pick<VO.BlacklistedTokenType, "token">) {
    await infra.db.tokenBlacklist.delete({ where });
  }

  static async list() {
    const tokens = await infra.db.tokenBlacklist.findMany();

    return tokens.map((token) => ({
      ...token,
      createdAt: bg.RelativeDate.truthy(Number(token.createdAt)),
    }));
  }

  static async getCountOfToken(where: Pick<VO.BlacklistedTokenType, "token">) {
    return infra.db.tokenBlacklist.count({ where });
  }

  static async getSuggestedBlacklistedTokens(
    limit: number,
  ): Promise<VO.TokenRatingType[]> {
    const minimumValueThreshold = -15;

    return infra.db.$queryRaw`
      SELECT tr.*
      FROM TokenRating tr
      LEFT JOIN TokenBlacklist tb ON tr.token = tb.token
      WHERE tb.token IS NULL
        AND (tr.dismissedUntil IS NULL OR tr.dismissedUntil < strftime('%s', 'now') * 1000)
        AND (tr.value <= ${minimumValueThreshold})
      ORDER BY tr.value ASC
      LIMIT ${limit};
    `;
  }
}
