import * as bg from "@bgord/node";
import { z } from "zod";

export enum TimestampFiltersEnum {
  today = "today",
  last_3_days = "last_3_days",
  last_week = "last_week",
  last_30_days = "last_30_days",
  all = "all",
}

export const TimeStampFilter = z
  .nativeEnum(TimestampFiltersEnum)
  .default(TimestampFiltersEnum.last_3_days)
  .transform((value) => {
    const now = Date.now();

    const DAY = bg.Time.Days(1).ms;
    const THREE_DAYS = bg.Time.Days(3).ms;
    const WEEK = bg.Time.Days(7).ms;
    const THIRTY_DAYS = bg.Time.Days(30).ms;

    if (value === TimestampFiltersEnum.today) {
      return { gte: now - DAY };
    }

    if (value === TimestampFiltersEnum.last_3_days) {
      return { gte: now - THREE_DAYS };
    }

    if (value === TimestampFiltersEnum.last_week) {
      return { gte: now - WEEK };
    }

    if (value === TimestampFiltersEnum.last_30_days) {
      return { gte: now - THIRTY_DAYS };
    }

    return undefined;
  });
