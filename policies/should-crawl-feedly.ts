import { Policy } from "@bgord/node";

import { Settings } from "../aggregates/settings";
import * as VO from "../value-objects";

export class ShouldCrawlFeedlyError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ShouldCrawlFeedlyError.prototype);
  }
}

type ShouldCrawlFeedlyConfigType = {
  settings: Settings;
};

class ShouldCrawlFeedlyFactory extends Policy<ShouldCrawlFeedlyConfigType> {
  fails(config: ShouldCrawlFeedlyConfigType) {
    return config.settings.isFeedlyCrawlingStopped === false;
  }

  error = ShouldCrawlFeedlyError;
}

export const ShouldCrawlFeedly = new ShouldCrawlFeedlyFactory();
