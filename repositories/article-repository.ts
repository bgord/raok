import { PrismaClient } from "@prisma/client";

import * as VO from "../value-objects";

const prisma = new PrismaClient();

export class ArticleRepository {
  static async getAllNonProcessed() {
    return prisma.article.findMany({
      where: { status: { not: VO.ArticleStatusEnum.processed } },
    });
  }

  static async create(article: {
    id: VO.ArticleType["id"];
    url: VO.ArticleType["url"];
    source: VO.ArticleType["source"];
    createdAt: VO.ArticleType["createdAt"];
  }) {
    return prisma.article.create({
      data: { ...article, status: VO.ArticleStatusEnum.ready },
    });
  }

  static async updateStatus(
    articleId: VO.ArticleType["id"],
    status: VO.ArticleType["status"]
  ) {
    return prisma.article.updateMany({
      where: { id: articleId },
      data: { status },
    });
  }

  static async delete(articleId: VO.ArticleType["id"]) {
    return prisma.article.delete({ where: { id: articleId } });
  }

  static async getNumbersOfArticlesWithUrl(articleUrl: VO.ArticleType["url"]) {
    return prisma.article.count({ where: { url: articleUrl } });
  }

  static async getNumbersOfArticlesWithId(articleId: VO.ArticleType["id"]) {
    return prisma.article.count({ where: { id: articleId } });
  }
}
