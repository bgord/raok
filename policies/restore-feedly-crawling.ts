import { Policy } from "@bgord/node";

import * as Aggregates from "../aggregates";
import * as VO from "../value-objects";

class RestoreFeedlyCrawlingError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, RestoreFeedlyCrawlingError.prototype);
  }
}

type RestoreFeedlyCrawlingConfigType = {
  settings: Aggregates.Settings;
};

class RestoreFeedlyCrawlingFactory extends Policy<RestoreFeedlyCrawlingConfigType> {
  fails(config: RestoreFeedlyCrawlingConfigType) {
    return config.settings.isFeedlyCrawlingStopped === false;
  }

  error = RestoreFeedlyCrawlingError;
}

export const RestoreFeedlyCrawling = new RestoreFeedlyCrawlingFactory();
