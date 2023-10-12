import * as infra from "../infra";

import { ArticleRepository } from "./article-repository";

export class StatsRepository {
  static async getAll() {
    const createdArticles = await infra.db.statsKeyValue.findFirst({
      where: { key: "createdArticles" },
    });

    const sentNewspapers = await infra.db.statsKeyValue.findFirst({
      where: { key: "sentNewspapers" },
    });

    const numberOfNonProcessedArticles =
      await ArticleRepository.getNumberOfNonProcessed();

    return {
      createdArticles: createdArticles?.value ?? 0,
      sentNewspapers: sentNewspapers?.value ?? 0,
      numberOfNonProcessedArticles,
    };
  }

  static async incrementCreatedArticles() {
    return infra.db.statsKeyValue.upsert({
      where: { key: "createdArticles" },
      update: { value: { increment: 1 } },
      create: { key: "createdArticles", value: 1 },
    });
  }

  static async incrementSentNewspapers() {
    return infra.db.statsKeyValue.upsert({
      where: { key: "sentNewspapers" },
      update: { value: { increment: 1 } },
      create: { key: "sentNewspapers", value: 1 },
    });
  }
}
