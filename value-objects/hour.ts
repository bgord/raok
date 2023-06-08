import _ from "lodash";
import { z } from "zod";

const hours = _.range(0, 24);

export const HourSchema = z
  .number()
  .refine((value) => hours.includes(value), { message: "invalid_hour" });

export type HourType = z.infer<typeof HourSchema>;

export class Hour {
  static hours: HourType[] = z.array(HourSchema).parse(hours);

  value: HourType;

  constructor(value: number) {
    this.value = HourSchema.parse(value);
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

  static format(value: HourType): { value: number; label: string } {
    return {
      value,
      label: `${String(value).padStart(2, "0")}:00`,
    };
  }
}
