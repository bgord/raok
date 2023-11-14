import * as bg from "@bgord/node";
import Parser from "rss-parser";

import * as VO from "../value-objects";

export class SourceUrlRespondsError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, SourceUrlRespondsError.prototype);
  }
}

type SourceUrlRespondsConfigType = {
  sourceUrl: VO.SourceType["url"];
};

class SourceUrlRespondsFactory extends bg.Policy<SourceUrlRespondsConfigType> {
  async fails(config: SourceUrlRespondsConfigType): Promise<boolean> {
    try {
      const parser = new Parser({ timeout: bg.Time.Seconds(5).ms });
      await parser.parseURL(config.sourceUrl);
      return false;
    } catch (error) {
      return true;
    }
  }

  message = "source.error.not_responds";

  error = SourceUrlRespondsError;
}

export const SourceUrlResponds = new SourceUrlRespondsFactory();
