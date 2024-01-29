import * as bg from "@bgord/node";
import crypto from "node:crypto";

import * as infra from "../../infra";

export class AdminUserCreator {
  static async create() {
    const id = bg.NewUUID.generate();
    const username = infra.Env.ADMIN_USERNAME;
    const password = infra.Env.ADMIN_PASSWORD;

    // TODO: Password VO
    const hash = crypto
      .pbkdf2Sync(password, "password", 1000, 64, "sha512")
      .toString("hex");

    await infra.db.user.upsert({
      where: { email: username },
      create: { id, email: username, password: hash },
      update: { email: username, password: hash },
    });
  }
}
