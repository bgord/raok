import * as bg from "@bgord/node";

import * as VO from "../value-objects";

export class NotificationHourShouldChangeError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, NotificationHourShouldChangeError.prototype);
  }
}

type NotificationHourShouldChangeConfigType = {
  current: VO.HourType;
  changed: VO.HourType;
};

class NotificationHourShouldChangeFactory extends bg.Policy<NotificationHourShouldChangeConfigType> {
  fails(config: NotificationHourShouldChangeConfigType) {
    return config.current === config.changed;
  }

  error = NotificationHourShouldChangeError;
}

export const NotificationHourShouldChange =
  new NotificationHourShouldChangeFactory();
