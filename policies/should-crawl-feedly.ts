import { Policy } from "@bgord/node";

import * as Aggregates from "../aggregates";
import * as VO from "../value-objects";

export class ShouldCrawlFeedlyError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ShouldCrawlFeedlyError.prototype);
  }
}

type ShouldCrawlFeedlyConfigType = {
  settings: Aggregates.Settings;
};

class ShouldCrawlFeedlyFactory extends Policy<ShouldCrawlFeedlyConfigType> {
  fails(config: ShouldCrawlFeedlyConfigType) {
    return config.settings.isFeedlyCrawlingStopped === true;
  }

  error = ShouldCrawlFeedlyError;
}

export const ShouldCrawlFeedly = new ShouldCrawlFeedlyFactory();
