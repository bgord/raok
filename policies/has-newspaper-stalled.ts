import { Policy } from "@bgord/node";

import * as VO from "../value-objects";
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
    const now = Date.now();
    const cutoff = 10 * 60 * 1000; // 10 minutes

    const hasCutoffPassed = now - config.scheduledAt > cutoff;

    return (
      ![
        VO.NewspaperStatusEnum.scheduled,
        VO.NewspaperStatusEnum.ready_to_send,
      ].includes(config.status) || !hasCutoffPassed
    );
  }

  error = NewspaperHasNotStalledError;
}

export const HasNewspaperStalled = new HasNewspaperStalledFactory();
