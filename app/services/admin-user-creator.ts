import * as bg from "@bgord/node";

import * as Auth from "../../auth";
import * as infra from "../../infra";

export class AdminUserCreator {
  static async create() {
    const id = bg.NewUUID.generate();
    const { ADMIN_USERNAME, ADMIN_PASSWORD } = infra.Env;

    const password = new Auth.Password(ADMIN_PASSWORD);
    const hashedPassword = await Auth.HashedPassword.fromPassword(password);

    await infra.db.user.upsert({
      where: { email: ADMIN_USERNAME },
      create: { id, email: ADMIN_USERNAME, password: hashedPassword.read() },
      update: { email: ADMIN_USERNAME, password: hashedPassword.read() },
    });
  }
}
