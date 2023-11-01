import * as bg from "@bgord/node";
import * as VO from "../value-objects";

class InvalidNewspaperStatusTransition extends Error {
  constructor(config: NewspaperStatusTransitionConfigType) {
    super();
    Object.setPrototypeOf(this, InvalidNewspaperStatusTransition.prototype);
    this.message = `Invalid Newspaper status transition: from ${config.from} to ${config.to}`;
  }
}
type NewspaperStatusTransitionConfigType = {
  from: VO.NewspaperType["status"];
  to: VO.NewspaperType["status"];
};

class NewspaperStatusTransitionFactory extends bg.Policy<NewspaperStatusTransitionConfigType> {
  async fails(config: NewspaperStatusTransitionConfigType) {
    const enums = VO.NewspaperStatusEnum;

    const transitions: Record<
      VO.NewspaperType["status"],
      VO.NewspaperType["status"][]
    > = {
      [enums.undetermined]: [enums.scheduled],
      [enums.scheduled]: [enums.ready_to_send, enums.error],
      [enums.ready_to_send]: [enums.delivered, enums.error],
      [enums.delivered]: [enums.archived, enums.scheduled],
      [enums.archived]: [],
      [enums.error]: [enums.scheduled, enums.archived],
    };

    return !transitions[config.from].includes(config.to);
  }

  message = "newspaper.status-transition.error";

  error = InvalidNewspaperStatusTransition;

  async perform(config: NewspaperStatusTransitionConfigType) {
    if (await this.fails(config)) {
      throw new this.error(config);
    }
  }
}

export const NewspaperStatusTransition = new NewspaperStatusTransitionFactory();
