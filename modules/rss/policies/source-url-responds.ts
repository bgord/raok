import * as bg from "@bgord/node";
import Parser from "rss-parser";

import * as VO from "../value-objects";
import * as infra from "./../../../infra";

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
      infra.logger.warn({
        message: "RSS source URL did not respond",
        operation: "policy_rss_url_responds",
        metadata: {
          url: config.sourceUrl,
          error: infra.logger.formatError(error),
        },
      });
      return true;
    }
  }

  message = "source.error.not_responds";

  error = SourceUrlRespondsError;
}

export const SourceUrlResponds = new SourceUrlRespondsFactory();
