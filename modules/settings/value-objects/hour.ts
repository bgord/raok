import * as bg from "@bgord/node";
import _ from "lodash";
import { z } from "zod";

export class Hour {
  static hours: bg.Schema.HourType[] = z
    .array(bg.Schema.Hour)
    .parse(bg.Schema.hours);

  private readonly value: bg.Schema.HourType;

  constructor(value: number) {
    this.value = bg.Schema.Hour.parse(value);
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

  static format(value: bg.Schema.HourType): { value: number; label: string } {
    return {
      value,
      label: `${String(value).padStart(2, "0")}:00`,
    };
  }
}
