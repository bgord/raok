import { UseFilterConfigType, useClientFilter } from "@bgord/frontend";

export enum TimestampFiltersEnum {
  today = "today",
  last_3_days = "last_3_days",
  last_week = "last_week",
  last_30_days = "last_30_days",
  all = "all",
}

function getWindow() {
  if (typeof window === "undefined") return undefined;
  return window;
}

export function useUrlFilter<T>(
  config: UseFilterConfigType<T> & { label: string }
) {
  const window = getWindow();

  const defaultQuery =
    new URLSearchParams(window?.location.search).get(config.label) ?? undefined;

  return useClientFilter({
    ...config,
    defaultQuery,
    onUpdate: (current, previous) => {
      if (!window) return;

      const url = new URL(window.location.toString());
      const params = new URLSearchParams(url.search);

      if (current === undefined) {
        params.delete(config.label);
      } else {
        params.set(config.label, current);
      }

      if (current === previous) return;

      if (current !== previous) {
        url.search = params.toString();
        history.pushState({}, "", url.toString());
      }
    },
  });
}
