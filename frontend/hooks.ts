import { h } from "preact";
import { useState } from "preact/hooks";

export function useSearch(): {
  query: string;
  clear: VoidFunction;
  onChange: (event: h.JSX.TargetedEvent<HTMLInputElement, Event>) => void;
  filterFn: (value: string) => boolean;
} {
  const defaultQuery = "";

  const [query, setValue] = useState<string>(defaultQuery);

  function clear() {
    setValue(defaultQuery);
  }

  function onChange(event: h.JSX.TargetedEvent<HTMLInputElement, Event>) {
    setValue(event.currentTarget.value);
  }

  function filterFn(value: string) {
    if (query === "") return true;

    return value?.toLowerCase().includes(query.toLowerCase());
  }

  return { query, clear, onChange, filterFn };
}

type UseFilterValueType = string;

export function useFilter<T = string>(config: {
  enum: { [key: string]: UseFilterValueType };
  defaultValue?: UseFilterValueType;
  filterFn?: (value: T) => boolean;
}) {
  const defaultValue = config.defaultValue ?? "all";

  const [query, setValue] = useState<UseFilterValueType>(defaultValue);

  function clear() {
    setValue(defaultValue);
  }

  function onChange(event: h.JSX.TargetedEvent<HTMLSelectElement, Event>) {
    const { value } = event.currentTarget;

    if (value !== "all" && !Boolean(config.enum[String(value)])) return;
    else setValue(value);
  }

  function filterFn(value: T) {
    if (query === "all") return true;

    return query === String(value);
  }

  const options = Object.keys(config.enum);

  return {
    query,
    clear,
    onChange,
    filterFn: config.filterFn ?? filterFn,
    options,
  };
}

enum TimestampFiltersEnum {
  today = "today",
  last_3_days = "last_3_days",
  last_week = "last_week",
  last_30_days = "last_30_days",
}
export function useTimestampFilter(config?: {
  defaultValue: Parameters<typeof useFilter>[0]["defaultValue"];
}) {
  const timestamp = useFilter<number | null | undefined>({
    enum: TimestampFiltersEnum,
    defaultValue: config?.defaultValue ?? "all",
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
