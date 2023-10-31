import * as bg from "@bgord/node";
import Parser from "rss-parser";

import * as VO from "../value-objects";

export class SourceUrlResponseError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, SourceUrlResponseError.prototype);
  }
}

type SourceUrlRespondsConfigType = {
  sourceUrl: VO.SourceType["url"];
};

class SourceUrlRespondsFactory extends bg.Policy<SourceUrlRespondsConfigType> {
  async fails(config: SourceUrlRespondsConfigType): Promise<boolean> {
    try {
      await new Parser().parseURL(config.sourceUrl);
      return false;
    } catch (error) {
      return true;
    }
  }

  message = "source.error.not_responds";

  error = SourceUrlResponseError;
}

export const SourceUrlResponds = new SourceUrlRespondsFactory();
