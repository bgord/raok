import { Policy } from "@bgord/node";

import { Settings } from "../aggregates/settings";
import * as VO from "../value-objects";

class StopFeedlyCrawlingError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, StopFeedlyCrawlingError.prototype);
  }
}

type StopFeedlyCrawlingConfigType = {
  settings: Settings;
};

class StopFeedlyCrawlingFactory extends Policy<StopFeedlyCrawlingConfigType> {
  fails(config: StopFeedlyCrawlingConfigType) {
    return config.settings.isFeedlyCrawlingStopped === true;
  }

  error = StopFeedlyCrawlingError;
}

export const StopFeedlyCrawling = new StopFeedlyCrawlingFactory();
