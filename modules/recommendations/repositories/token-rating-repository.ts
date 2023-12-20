import * as VO from "../value-objects";

import * as infra from "../../../infra";

export class TokenRatingRepository {
  static async upsert(payload: VO.TokenRatingType) {
    const now = Date.now();

    await infra.db.tokenRating.upsert({
      where: { token: payload.token },
      update: { value: { increment: payload.value }, updatedAt: now },
      create: { ...payload, createdAt: now },
    });
  }
}
