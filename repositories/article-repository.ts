import { PrismaClient } from "@prisma/client";

import * as VO from "../value-objects";

const prisma = new PrismaClient();

export class ArticleRepository {
  static async getAll() {
    return prisma.article.findMany();
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
