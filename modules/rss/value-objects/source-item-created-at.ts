import * as bg from "@bgord/node";
import {
  isWithinInterval,
  max,
  subMonths,
  subDays,
  endOfToday,
} from "date-fns";

export class SourceItemCreatedAt {
  constructor(readonly isoDate: string | undefined) {}

  public isAcceptable(_sourceProcessedUntil: bg.RelativeDateType): boolean {
    if (!this.isoDate) return false;

    return isWithinInterval(new Date(this.isoDate), {
      start: max([
        subMonths(new Date(), 3),
        subDays(_sourceProcessedUntil.raw, 3),
      ]),
      end: endOfToday(),
    });
  }
}
