import * as bg from "@bgord/node";
import * as Aggregates from "../aggregates";

class RestoreFeedlyCrawlingError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, RestoreFeedlyCrawlingError.prototype);
  }
}

type RestoreFeedlyCrawlingConfigType = {
  settings: Aggregates.Settings;
};

class RestoreFeedlyCrawlingFactory extends bg.Policy<RestoreFeedlyCrawlingConfigType> {
  fails(config: RestoreFeedlyCrawlingConfigType) {
    return config.settings.isFeedlyCrawlingStopped === false;
  }

  message = "dashboard.crawling.restore.error";

  error = RestoreFeedlyCrawlingError;
}

export const RestoreFeedlyCrawling = new RestoreFeedlyCrawlingFactory();
