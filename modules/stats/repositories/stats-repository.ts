import * as bg from "@bgord/node";

import * as infra from "../../../infra";
import { decorators } from "../../../infra/decorators";

import * as Newspapers from "../../newspapers";

const rounding = new bg.RoundToNearest();

export class StatsRepository {
  @decorators.duration()
  static async getAll() {
    const createdArticles = await infra.db.statsKeyValue.findUnique({
      where: { key: "createdArticles" },
    });

    const openedArticles = await infra.db.statsKeyValue.findUnique({
      where: { key: "openedArticles" },
    });

    const readArticles = await infra.db.statsKeyValue.findUnique({
      where: { key: "readArticles" },
    });

    const sentArticles = await infra.db.statsKeyValue.findUnique({
      where: { key: "sentArticles" },
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
        openedArticles: openedArticles?.value ?? 0,
        readArticles: readArticles?.value ?? 0,
        sentArticles: sentArticles?.value ?? 0,
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
      openedArticles: openedArticles?.value ?? 0,
      readArticles: readArticles?.value ?? 0,
      sentArticles: sentArticles?.value ?? 0,
    };
  }

  static async incrementCreatedArticles() {
    return infra.db.statsKeyValue.upsert({
      where: { key: "createdArticles" },
      update: { value: { increment: 1 } },
      create: { key: "createdArticles", value: 1 },
    });
  }

  static async incrementOpenedArticles() {
    return infra.db.statsKeyValue.upsert({
      where: { key: "openedArticles" },
      update: { value: { increment: 1 } },
      create: { key: "openedArticles", value: 1 },
    });
  }

  static async incrementReadArticles() {
    return infra.db.statsKeyValue.upsert({
      where: { key: "readArticles" },
      update: { value: { increment: 1 } },
      create: { key: "readArticles", value: 1 },
    });
  }

  static async incrementSentArticles() {
    return infra.db.statsKeyValue.upsert({
      where: { key: "sentArticles" },
      update: { value: { increment: 1 } },
      create: { key: "sentArticles", value: 1 },
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
