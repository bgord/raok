import * as z from "zod";

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

    const DAY = 24 * 60 * 60 * 1000;
    const THREE_DAYS = 3 * DAY;
    const WEEK = 7 * DAY;
    const THIRTY_DAYS = 30 * DAY;

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
