import * as bg from "@bgord/node";

export class NotificationHourShouldChangeError extends Error {
  constructor() {
    super();
    Object.setPrototypeOf(this, NotificationHourShouldChangeError.prototype);
  }
}

type NotificationHourShouldChangeConfigType = {
  current: bg.Schema.HourType;
  changed: bg.Schema.HourType;
};

class NotificationHourShouldChangeFactory extends bg.Policy<NotificationHourShouldChangeConfigType> {
  fails(config: NotificationHourShouldChangeConfigType) {
    return config.current === config.changed;
  }

  message = "articles-to-review-notification.hour.change.error";

  error = NotificationHourShouldChangeError;
}

export const NotificationHourShouldChange =
  new NotificationHourShouldChangeFactory();
