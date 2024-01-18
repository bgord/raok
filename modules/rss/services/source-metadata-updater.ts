import * as bg from "@bgord/node";
import { parseISO } from "date-fns";

import * as VO from "../value-objects";
import * as Repos from "../repositories";

export type SourceMetadataType = { countValue: number; countStrategy: string };

type SourceItemType = { isoDate: string };

export class SourceMetadataUpdater {
  static map(items: unknown[]) {
    const countValue = items
      .filter(
        (item): item is SourceItemType =>
          typeof item === "object" &&
          item !== null &&
          "isoDate" in item &&
          typeof item.isoDate === "string"
      )
      .map((item) => parseISO(item.isoDate).getTime())
      .filter((createdAtTimestamp: number) =>
        bg.Time.Ms(createdAtTimestamp).isAfter(
          bg.Time.Now().Minus(bg.Time.Days(30))
        )
      ).length;

    return { countValue, countStrategy: "total_last_month" };
  }

  static async update(id: VO.SourceIdType, metadata: SourceMetadataType) {
    await Repos.SourceRepository.updateMetadata(id, metadata);
  }
}
