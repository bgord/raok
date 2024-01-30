import * as bg from "@bgord/node";
import { Argon2id } from "oslo/password";

import * as infra from "../../infra";

export class AdminUserCreator {
  static async create() {
    const id = bg.NewUUID.generate();
    const username = infra.Env.ADMIN_USERNAME;
    const password = infra.Env.ADMIN_PASSWORD;

    const hash = await new Argon2id().hash(password);

    await infra.db.user.upsert({
      where: { email: username },
      create: { id, email: username, password: hash },
      update: { email: username, password: hash },
    });
  }
}
