import * as bg from "@bgord/node";
import * as Aggregates from "../aggregates";

import { hasNewspaperStalled } from "./common";

class NewspaperHasNotStalledError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, NewspaperHasNotStalledError.prototype);
  }
}

type NoEmptyNewspaperConfigType = {
  status: Aggregates.Newspaper["status"];
  scheduledAt: Aggregates.Newspaper["scheduledAt"];
};

class HasNewspaperStalledFactory extends bg.Policy<NoEmptyNewspaperConfigType> {
  async fails(config: NoEmptyNewspaperConfigType) {
    return !hasNewspaperStalled({
      status: config.status,
      scheduledAt: config.scheduledAt,
    });
  }

  message = "newspaper.stalled.error";

  error = NewspaperHasNotStalledError;
}

export const HasNewspaperStalled = new HasNewspaperStalledFactory();
