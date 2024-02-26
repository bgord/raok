import * as bg from "@bgord/node";

export class WeeklyStatsRange {
  readonly from: number;

  readonly to: number;

  constructor() {
    this.from = bg.Time.Now().Minus(bg.Time.Days(7)).ms;
    this.to = Date.now();
  }
}
