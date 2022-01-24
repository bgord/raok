import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class StatsRepository {
  static async getAll() {
    const stats = await prisma.stats.findFirst();

    const createdArticles = await prisma.statsKeyValue.findFirst({
      where: { key: "createdArticles" },
    });

    const sentNewspapers = await prisma.statsKeyValue.findFirst({
      where: { key: "sentNewspapers" },
    });

    if (stats) {
      return {
        ...stats,
        createdArticles: createdArticles?.value ?? 0,
        sentNewspapers: sentNewspapers?.value ?? 0,
      };
    }

    const newStats = {
      createdArticles: 0,
      sentNewspapers: 0,
      lastFeedlyImport: 0,
    };

    return prisma.stats.create({ data: newStats });
  }

  static async kv_incrementCreatedArticles() {
    return prisma.statsKeyValue.upsert({
      where: { key: "createdArticles" },
      update: { value: { increment: 1 } },
      create: { key: "createdArticles", value: 1 },
    });
  }

  static async kv_incrementSentNewspapers() {
    return prisma.statsKeyValue.upsert({
      where: { key: "sentNewspapers" },
      update: { value: { increment: 1 } },
      create: { key: "sentNewspapers", value: 1 },
    });
  }

  static async updateLastFeedlyImport(timestamp: number) {
    return prisma.stats.updateMany({
      data: { lastFeedlyImport: timestamp },
    });
  }
}
