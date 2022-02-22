import { PrismaClient, Article } from "@prisma/client";
import _ from "lodash";

import * as VO from "../value-objects";

const prisma = new PrismaClient();

export class ArticleRepository {
  static async getAll() {
    const result = await prisma.article.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return result.map(ArticleRepository._mapper);
  }

  static async getAllNonProcessed() {
    const articles = await prisma.article.findMany({
      where: { status: VO.ArticleStatusEnum.ready },
    });

    return articles.map((article) => ({
      ...article,
      title: article?.title ?? "-",
    }));
  }

  static async getNumberOfNonProcessed() {
    return prisma.article.count({
      where: { status: VO.ArticleStatusEnum.ready },
    });
  }

  static async getFavourite() {
    const result = await prisma.article.findMany({
      where: { favourite: true },
      orderBy: { favouritedAt: "asc" },
    });

    return result
      .map(ArticleRepository._mapper)
      .map((article) => _.pick(article, "id", "url", "title"));
  }

  static async create(article: {
    id: VO.ArticleType["id"];
    url: VO.ArticleType["url"];
    source: VO.ArticleType["source"];
    createdAt: VO.ArticleType["createdAt"];
    title: VO.ArticleMetatagsType["title"];
    favourite: VO.ArticleType["favourite"];
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

  static async addToFavourites(articleId: VO.ArticleType["id"]) {
    return prisma.article.update({
      where: { id: articleId },
      data: { favourite: true, favouritedAt: Date.now() },
    });
  }

  static async deleteFromFavourites(articleId: VO.ArticleType["id"]) {
    return prisma.article.update({
      where: { id: articleId },
      data: { favourite: false },
    });
  }

  static async assignToNewspaper(
    articleId: VO.ArticleType["id"],
    newspaperId: VO.NewspaperType["id"]
  ) {
    return prisma.article.update({
      where: { id: articleId },
      data: { newspaperId },
    });
  }

  static async delete(articleId: VO.ArticleType["id"]) {
    return prisma.article.delete({ where: { id: articleId } });
  }

  static async getNumbersOfNonProcessedArticlesWithUrl(
    articleUrl: VO.ArticleType["url"]
  ) {
    return prisma.article.count({
      where: { url: articleUrl, status: VO.ArticleStatusEnum.ready },
    });
  }

  static async getNumbersOfArticlesWithUrl(articleUrl: VO.ArticleType["url"]) {
    return prisma.article.count({
      where: { url: articleUrl, source: VO.ArticleSourceEnum.feedly },
    });
  }

  static _mapper(article: Article) {
    return { ...article, title: article.title ?? "-" };
  }
}
