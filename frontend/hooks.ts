import { useClientFilter } from "@bgord/frontend";

export enum TimestampFiltersEnum {
  today = "today",
  last_3_days = "last_3_days",
  last_week = "last_week",
  last_30_days = "last_30_days",
}

export function useTimestampFilter(config?: {
  defaultQuery: TimestampFiltersEnum;
}) {
  const timestamp = useClientFilter<number | null | undefined>({
    enum: TimestampFiltersEnum,
    defaultQuery: config?.defaultQuery ?? "all",
    filterFn: (value) => {
      if (timestamp.query === "all") return true;

      if (!value) return false;

      const timeSinceSent = Date.now() - value;

      const DAY = 24 * 60 * 60 * 1000;
      if (timestamp.query === "today") return timeSinceSent <= DAY;

      const THREE_DAYS = 3 * DAY;
      if (timestamp.query === "last_3_days") return timeSinceSent <= THREE_DAYS;

      const WEEK = 7 * DAY;
      if (timestamp.query === "last_week") return timeSinceSent <= WEEK;

      const THIRTY_DAYS = 30 * DAY;
      if (timestamp.query === "last_30_days")
        return timeSinceSent <= THIRTY_DAYS;

      return false;
    },
  });

  return timestamp;
}
