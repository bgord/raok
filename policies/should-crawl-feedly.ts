import * as bg from "@bgord/node";
import * as Aggregates from "../aggregates";

export class ShouldCrawlFeedlyError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, ShouldCrawlFeedlyError.prototype);
  }
}

type ShouldCrawlFeedlyConfigType = {
  settings: Aggregates.Settings;
};

class ShouldCrawlFeedlyFactory extends bg.Policy<ShouldCrawlFeedlyConfigType> {
  fails(config: ShouldCrawlFeedlyConfigType) {
    return config.settings.isFeedlyCrawlingStopped === true;
  }

  message = "dashboard.crawling.stopped";

  error = ShouldCrawlFeedlyError;
}

export const ShouldCrawlFeedly = new ShouldCrawlFeedlyFactory();
