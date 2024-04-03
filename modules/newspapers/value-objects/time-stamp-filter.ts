import * as bg from "@bgord/node";
import { z } from "zod";

enum TimestampFiltersEnum {
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
    if (value === TimestampFiltersEnum.today) {
      return { gte: bg.Time.Now().Minus(bg.Time.Days(1)).ms };
    }

    if (value === TimestampFiltersEnum.last_3_days) {
      return { gte: bg.Time.Now().Minus(bg.Time.Days(3)).ms };
    }

    if (value === TimestampFiltersEnum.last_week) {
      return { gte: bg.Time.Now().Minus(bg.Time.Days(7)).ms };
    }

    if (value === TimestampFiltersEnum.last_30_days) {
      return { gte: bg.Time.Now().Minus(bg.Time.Days(30)).ms };
    }

    return undefined;
  });
