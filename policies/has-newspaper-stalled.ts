import { Policy } from "@bgord/node";

import { hasNewspaperStalled } from "./common";
import * as Aggregates from "../aggregates";

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

class HasNewspaperStalledFactory extends Policy<NoEmptyNewspaperConfigType> {
  async fails(config: NoEmptyNewspaperConfigType) {
    return !hasNewspaperStalled({
      status: config.status,
      scheduledAt: config.scheduledAt,
    });
  }

  error = NewspaperHasNotStalledError;
}

export const HasNewspaperStalled = new HasNewspaperStalledFactory();
