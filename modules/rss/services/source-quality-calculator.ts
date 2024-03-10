import * as bg from "@bgord/node";
import * as Newspapers from "../../newspapers";

export class SourceQualityCalculator {
  static calculate(
    config: Record<Newspapers.VO.ArticleStatusEnum, number>
  ): number | undefined {
    const total = Object.values(config).reduce((acc, curr) => acc + curr, 0);
    if (total === 0) return undefined;

    const considered = total - config.ready;
    if (considered === 0) return undefined;

    const interactedWith = config.in_progress + config.read + config.processed;
    if (interactedWith === 0) return 0;

    return new bg.RoundUp().round((interactedWith / considered) * 100);
  }
}
