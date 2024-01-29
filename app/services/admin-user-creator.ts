import * as bg from "@bgord/node";
import crypto from "node:crypto";

import * as infra from "../../infra";

export class AdminUserCreator {
  static async seed() {
    const id = bg.NewUUID.generate();
    const username = infra.Env.ADMIN_USERNAME;
    const password = infra.Env.ADMIN_PASSWORD;

    // TODO: Password VO
    const hash = crypto
      .pbkdf2Sync(password, "password", 1000, 64, "sha512")
      .toString("hex");

    const result = await infra.db.user.upsert({
      where: { email: username },
      create: { id, email: username, password: hash },
      update: { email: username, password: hash },
    });

    try {
      const session = await infra.lucia.createSession(result.id, {});
      console.log(session);
    } catch (error) {
      console.error(error);
    }
  }
}
