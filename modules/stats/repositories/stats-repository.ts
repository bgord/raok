import * as bg from "@bgord/node";

import * as infra from "../../../infra";

import * as Newspapers from "../../newspapers";

const rounding = new bg.RoundToNearest();

export class StatsRepository {
  static async getAll() {
    const createdArticles = await infra.db.statsKeyValue.findUnique({
      where: { key: "createdArticles" },
    });

    const sentNewspapers = await infra.db.statsKeyValue.findUnique({
      where: { key: "sentNewspapers" },
    });

    const numberOfNonProcessedArticles =
      await Newspapers.Repos.ArticleRepository.getNumberOfNonProcessed();

    const firstArticle = await infra.db.article.findFirst({
      select: { createdAt: true },
      orderBy: { createdAt: "asc" },
      take: 1,
    });

    if (!firstArticle || !createdArticles?.value) {
      return {
        createdArticles: createdArticles?.value ?? 0,
        sentNewspapers: sentNewspapers?.value ?? 0,
        numberOfNonProcessedArticles,
        articlesPerDay: null,
      };
    }

    const daysSinceFirstArticle = rounding.round(
      (Date.now() - firstArticle.createdAt) / bg.Time.Days(1).ms
    );

    const articlesPerDay = rounding.round(
      createdArticles.value / daysSinceFirstArticle
    );

    return {
      createdArticles: createdArticles?.value ?? 0,
      sentNewspapers: sentNewspapers?.value ?? 0,
      numberOfNonProcessedArticles,
      articlesPerDay,
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
