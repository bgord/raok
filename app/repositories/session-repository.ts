import * as infra from "../../infra";

export class SessionRepository {
  static async removeExpired() {
    await infra.db.session.deleteMany({
      where: { expiresAt: { lte: new Date() } },
    });
  }
}
