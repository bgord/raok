import * as bg from "@bgord/node";
import df from "date-fns";

export class SourceItemCreatedAt {
  constructor(readonly isoDate: string | undefined) {}

  public isAcceptable(_sourceProcessedUntil: bg.RelativeDateType): boolean {
    if (!this.isoDate) return false;

    return df.isWithinInterval(new Date(this.isoDate), {
      start: df.max([
        df.subMonths(new Date(), 3),
        df.subDays(_sourceProcessedUntil.raw, 3),
      ]),
      end: df.endOfToday(),
    });
  }
}
