import * as VO from "../value-objects";
import * as Repos from "../repositories";

export class StopWordsCleaner {
  static async run() {
    await Repos.TokenRatingRepository.deleteMany(VO.STOP_WORDS);
  }
}
