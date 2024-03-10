import * as infra from "../../../infra";

import * as Newspapers from "../../newspapers";
import { SourceRepository } from "../repositories/source-repository";
import { SourceQualityCalculator } from "./source-quality-calculator";

export class SourceQualityUpdater {
  static async update() {
    const sources = await SourceRepository.listActive();

    for (const source of sources) {
      const quality = SourceQualityCalculator.calculate({
        read: await infra.db.article.count({
          where: {
            status: Newspapers.VO.ArticleStatusEnum.read,
            rssSourceId: source.id,
          },
        }),
        ready: await infra.db.article.count({
          where: {
            status: Newspapers.VO.ArticleStatusEnum.ready,
            rssSourceId: source.id,
          },
        }),
        in_progress: await infra.db.article.count({
          where: {
            status: Newspapers.VO.ArticleStatusEnum.in_progress,
            rssSourceId: source.id,
          },
        }),
        processed: await infra.db.article.count({
          where: {
            status: Newspapers.VO.ArticleStatusEnum.processed,
            rssSourceId: source.id,
          },
        }),
        deleted: await infra.db.article.count({
          where: {
            status: Newspapers.VO.ArticleStatusEnum.deleted,
            rssSourceId: source.id,
          },
        }),
      });

      await SourceRepository.updateMetadata(source.id, { quality });
    }
  }
}
