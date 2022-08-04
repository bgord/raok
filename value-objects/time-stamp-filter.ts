import * as z from "zod";
import { Time } from "@bgord/node";

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

    const DAY = Time.Days(1).toMs();
    const THREE_DAYS = Time.Days(3).toMs();
    const WEEK = Time.Days(7).toMs();
    const THIRTY_DAYS = Time.Days(30).toMs();

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
