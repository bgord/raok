import { Policy } from "@bgord/node";

import { hasNewspaperStalled } from "./common";
import { Newspaper } from "../aggregates/newspaper";

class NewspaperHasNotStalledError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, NewspaperHasNotStalledError.prototype);
  }
}

type NoEmptyNewspaperConfigType = {
  status: Newspaper["status"];
  scheduledAt: Newspaper["scheduledAt"];
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
