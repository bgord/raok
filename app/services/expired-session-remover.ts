import * as bg from "@bgord/node";

import * as Repos from "../repositories";

export class ExpiredSessionRemover {
  static cron = bg.Jobs.SCHEDULES.EVERY_MINUTE;

  /** @public */
  static label = "ExpiredSessionRemover";

  /** @public */
  static async process() {
    await Repos.SessionRepository.removeExpired();
  }
}
