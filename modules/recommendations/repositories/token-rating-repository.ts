import * as VO from "../value-objects";

import * as infra from "../../../infra";

export class TokenRatingRepository {
  static async upsert(payload: VO.TokenRatingType) {
    const now = Date.now();

    await infra.db.tokenRating.upsert({
      where: { token: payload.token },
      update: {
        value:
          payload.value >= 0
            ? { increment: payload.value }
            : { decrement: Math.abs(payload.value) },
        updatedAt: now,
      },
      create: { ...payload, createdAt: now },
    });
  }

  static async list(tokens: VO.TokenType[]) {
    return infra.db.tokenRating.findMany({ where: { token: { in: tokens } } });
  }

  static async get(token: VO.TokenType) {
    return infra.db.tokenRating.findUnique({ where: { token } });
  }

  static async deleteMany(tokens: VO.TokenType[]) {
    return infra.db.tokenRating.deleteMany({
      where: { token: { in: tokens } },
    });
  }
}
