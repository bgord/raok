import * as bg from "@bgord/node";

import * as infra from "../../../infra";

export class DeviceMigrator {
  static async migrate() {
    const id = bg.NewUUID.generate();
    const name = "Default device";
    const email = infra.Env.EMAIL_TO_DELIVER_TO;
    const createdAt = BigInt(Date.now());

    await infra.db.device.upsert({
      where: { email },
      create: { id, email, name, createdAt },
      update: { email },
    });
  }
}
