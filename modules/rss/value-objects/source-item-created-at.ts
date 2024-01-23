import { isWithinInterval, subMonths, startOfToday } from "date-fns";

export class SourceItemCreatedAt {
  constructor(readonly isoDate: string | undefined) {}

  public isAcceptable(): boolean {
    if (!this.isoDate) return false;

    return isWithinInterval(new Date(this.isoDate), {
      start: subMonths(startOfToday(), 3),
      end: startOfToday(),
    });
  }
}
