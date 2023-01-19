import * as bg from "@bgord/node";

import * as VO from "../value-objects";
import { db } from "../db";

import { ArticleRepository } from "./article-repository";

export class StatsRepository {
  static async getAll() {
    const createdArticles = await db.statsKeyValue.findFirst({
      where: { key: "createdArticles" },
    });

    const sentNewspapers = await db.statsKeyValue.findFirst({
      where: { key: "sentNewspapers" },
    });

    const lastFeedlyImport = await db.statsKeyValue.findFirst({
      where: { key: "lastFeedlyImport" },
    });

    const lastFeedlyTokenExpiredError = await db.statsKeyValue.findFirst({
      where: { key: "lastFeedlyTokenExpiredError" },
    });

    const numberOfNonProcessedArticles =
      await ArticleRepository.getNumberOfNonProcessed();

    return {
      lastFeedlyImport: bg.ComplexDate.falsy(lastFeedlyImport?.value),
      createdArticles: createdArticles?.value ?? 0,
      sentNewspapers: sentNewspapers?.value ?? 0,
      lastFeedlyTokenExpiredError: lastFeedlyTokenExpiredError?.value ?? null,
      hasFeedlyTokenExpired: VO.FeedlyToken.hasExpired(
        lastFeedlyTokenExpiredError?.value
      ),
      numberOfNonProcessedArticles,
    };
  }

  static async incrementCreatedArticles() {
    return db.statsKeyValue.upsert({
      where: { key: "createdArticles" },
      update: { value: { increment: 1 } },
      create: { key: "createdArticles", value: 1 },
    });
  }

  static async incrementSentNewspapers() {
    return db.statsKeyValue.upsert({
      where: { key: "sentNewspapers" },
      update: { value: { increment: 1 } },
      create: { key: "sentNewspapers", value: 1 },
    });
  }

  static async updateLastFeedlyImport(timestamp: number) {
    return db.statsKeyValue.upsert({
      where: { key: "lastFeedlyImport" },
      update: { value: timestamp },
      create: { key: "lastFeedlyImport", value: timestamp },
    });
  }

  static async updateLastFeedlyTokenExpiredError(timestamp: number) {
    return db.statsKeyValue.upsert({
      where: { key: "lastFeedlyTokenExpiredError" },
      update: { value: timestamp },
      create: { key: "lastFeedlyTokenExpiredError", value: timestamp },
    });
  }
}
