import * as bg from "@bgord/node";
import * as Newspapers from "../../newspapers";

export class SourceQualityCalculator {
  static calculate(
    config: Record<Newspapers.VO.ArticleStatusEnum, number>,
  ): number | undefined {
    const total = Object.values(config).reduce((acc, curr) => acc + curr, 0);
    if (total === 0) return undefined;

    const considered = total - config.ready;
    if (considered === 0) return undefined;

    const interactedWith = config.in_progress + config.read + config.processed;

    return bg.Percentage.of(interactedWith, considered);
  }
}
