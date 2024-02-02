import * as bg from "@bgord/node";
import { isWithinInterval, subMonths, endOfToday, max } from "date-fns";

export class SourceItemCreatedAt {
  constructor(readonly isoDate: string | undefined) {}

  public isAcceptable(sourceProcessedUntil: bg.RelativeDateType): boolean {
    if (!this.isoDate) return false;

    return isWithinInterval(new Date(this.isoDate), {
      start: max([
        subMonths(endOfToday(), 3),
        new Date(sourceProcessedUntil.raw),
      ]),
      end: endOfToday(),
    });
  }
}
