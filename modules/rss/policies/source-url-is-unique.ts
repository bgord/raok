import * as bg from "@bgord/node";
import * as VO from "../value-objects";
import * as Repos from "../repositories";

export class SourceUrlIsNotUniqueError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, SourceUrlIsNotUniqueError.prototype);
  }
}

type SourceUrlIsUniqueConfigType = {
  sourceUrl: VO.SourceType["url"];
};

class SourceUrlIsUniqueFactory extends bg.Policy<SourceUrlIsUniqueConfigType> {
  async fails(config: SourceUrlIsUniqueConfigType): Promise<boolean> {
    const numbersOfSourcesWithUrl = await Repos.SourceRepository.countUrl({
      url: config.sourceUrl,
    });

    return numbersOfSourcesWithUrl > 0;
  }

  message = "source.error.not_unique";

  error = SourceUrlIsNotUniqueError;
}

export const SourceUrlIsUnique = new SourceUrlIsUniqueFactory();
