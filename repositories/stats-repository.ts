import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class StatsRepository {
  static async getAll() {
    const createdArticles = await prisma.statsKeyValue.findFirst({
      where: { key: "createdArticles" },
    });

    const sentNewspapers = await prisma.statsKeyValue.findFirst({
      where: { key: "sentNewspapers" },
    });

    const lastFeedlyImport = await prisma.statsKeyValue.findFirst({
      where: { key: "lastFeedlyImport" },
    });

    return {
      lastFeedlyImport: lastFeedlyImport?.value ?? 0,
      createdArticles: createdArticles?.value ?? 0,
      sentNewspapers: sentNewspapers?.value ?? 0,
    };
  }

  static async incrementCreatedArticles() {
    return prisma.statsKeyValue.upsert({
      where: { key: "createdArticles" },
      update: { value: { increment: 1 } },
      create: { key: "createdArticles", value: 1 },
    });
  }

  static async incrementSentNewspapers() {
    return prisma.statsKeyValue.upsert({
      where: { key: "sentNewspapers" },
      update: { value: { increment: 1 } },
      create: { key: "sentNewspapers", value: 1 },
    });
  }

  static async updateLastFeedlyImport(timestamp: number) {
    return prisma.statsKeyValue.upsert({
      where: { key: "lastFeedlyImport" },
      update: { value: timestamp },
      create: { key: "lastFeedlyImport", value: timestamp },
    });
  }
}
