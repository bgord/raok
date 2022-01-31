import _ from "lodash";
import { z } from "zod";
import { Brand, toBrand } from "@bgord/node";

const hours = _.range(0, 23);

const HourSchema = z
  .number()
  .refine((value) => hours.includes(value), { message: "invalid_hour" });

export type HourType = Brand<"hour", z.infer<typeof HourSchema>>;

export const hour = toBrand<HourType>(HourSchema);

export class Hour {
  static hours: HourType[] = z.array(hour).parse(hours);

  value: HourType;

  constructor(value: number) {
    this.value = hour.parse(value);
  }

  equals(anotherHour: Hour) {
    return this.value === anotherHour.value;
  }

  static list() {
    return Hour.hours;
  }

  static listFormatted() {
    return Hour.hours.map(Hour.format);
  }

  static format(value: HourType) {
    return {
      value,
      label: `${String(value).padStart(2, "0")}:00`,
    };
  }
}
