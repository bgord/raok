import * as bg from "@bgord/frontend";
import { h } from "preact";

import * as types from "./types";

enum HealthLevel {
  no = "no",
  month = "month",
  week = "week",
  three_days = "three_days",
  one_day = "one_day",
}

function getHealthLevel(value: number): HealthLevel {
  if (!value) return HealthLevel.no;
  if (value >= Date.now() - bg.Time.Days(1).ms) return HealthLevel.one_day;
  if (value >= Date.now() - bg.Time.Days(3).ms) return HealthLevel.three_days;
  if (value >= Date.now() - bg.Time.Days(7).ms) return HealthLevel.week;
  if (value >= Date.now() - bg.Time.Days(30).ms) return HealthLevel.month;
  return HealthLevel.no;
}

export function Health(props: Pick<types.SourceType, "updatedAt">) {
  const level = getHealthLevel(props.updatedAt.raw);

  const healthLevelToColor: Record<HealthLevel, string> = {
    [HealthLevel.no]: "gray-300",
    [HealthLevel.month]: "green-100",
    [HealthLevel.week]: "green-200",
    [HealthLevel.three_days]: "green-400",
    [HealthLevel.one_day]: "green-600",
  };

  return (
    <svg
      data-my="auto"
      data-shrink="0"
      /* eslint-disable security/detect-object-injection */
      data-color={healthLevelToColor[level]}
      {...bg.Rhythm(8).times(1).style.square}
    >
      <circle cx="50%" cy="50%" r="50%" fill="currentColor" />
    </svg>
  );
}
