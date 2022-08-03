import { Policy } from "@bgord/node";

import * as Aggregates from "../aggregates";
import * as VO from "../value-objects";

class StopFeedlyCrawlingError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, StopFeedlyCrawlingError.prototype);
  }
}

type StopFeedlyCrawlingConfigType = {
  settings: Aggregates.Settings;
};

class StopFeedlyCrawlingFactory extends Policy<StopFeedlyCrawlingConfigType> {
  fails(config: StopFeedlyCrawlingConfigType) {
    return config.settings.isFeedlyCrawlingStopped === true;
  }

  error = StopFeedlyCrawlingError;
}

export const StopFeedlyCrawling = new StopFeedlyCrawlingFactory();
