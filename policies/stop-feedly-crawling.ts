import * as bg from "@bgord/node";
import * as Aggregates from "../aggregates";

class StopFeedlyCrawlingError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, StopFeedlyCrawlingError.prototype);
  }
}

type StopFeedlyCrawlingConfigType = {
  settings: Aggregates.Settings;
};

class StopFeedlyCrawlingFactory extends bg.Policy<StopFeedlyCrawlingConfigType> {
  fails(config: StopFeedlyCrawlingConfigType) {
    return config.settings.isFeedlyCrawlingStopped === true;
  }

  message = "dashboard.crawling.error";

  error = StopFeedlyCrawlingError;
}

export const StopFeedlyCrawling = new StopFeedlyCrawlingFactory();
