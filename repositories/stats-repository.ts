import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class StatsRepository {
  static async getAll() {
    const stats = await prisma.stats.findFirst();

    if (stats) return stats;

    const newStats = { createdArticles: 0, sentNewspapers: 0 };

    return prisma.stats.create({ data: newStats });
  }

  static async incrementCreatedArticles() {
    return prisma.stats.updateMany({
      data: { createdArticles: { increment: 1 } },
    });
  }

  static async incrementSentNewspapers() {
    return prisma.stats.updateMany({
      data: { sentNewspapers: { increment: 1 } },
    });
  }
}
