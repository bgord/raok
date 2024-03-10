import { SourceMetadataType } from "./source-metadata-updater";

export class SourceQualityAlarm {
  static isAlarming(
    quality: SourceMetadataType["quality"] | null,
    count: SourceMetadataType["countValue"],
  ): boolean {
    if (quality !== 0) return false;
    return count > 10;
  }
}
