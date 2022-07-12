import * as z from "zod";
import * as bg from "@bgord/node";
import { Prisma, PrismaClient } from "@prisma/client";
import _ from "lodash";

import * as VO from "../value-objects";

const prisma = new PrismaClient();

export const ArchiveArticlesFilter = new bg.Filter(
  z.object({
    status: VO.ArticleStatus.optional(),
    source: VO.ArticleSource.optional(),
    createdAt: VO.TimeStampFilter,
  })
);

export class ArticleRepository {
  static async getAll(filters?: Prisma.ArticleWhereInput) {
    return prisma.article.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        url: true,
        source: true,
        title: true,
        createdAt: true,
        favourite: true,
        status: true,
      },
      where: _.merge(filters, {
        status: { not: VO.ArticleStatusEnum.deleted },
      }),
    });
  }

  static async getAllNonProcessed(filters?: Prisma.ArticleWhereInput) {
    const articles = await prisma.article.findMany({
      where: _.merge(filters, { status: VO.ArticleStatusEnum.ready }),
      select: {
        id: true,
        url: true,
        source: true,
        title: true,
        createdAt: true,
      },
    });

    return articles.map((article) => ({
      ...article,
      createdAt: {
        raw: article.createdAt,
        relative: bg.DateFormatters.relative(article.createdAt),
      },
    }));
  }

  static async getOld(marker: VO.ArticleOldMarkerType) {
    return ArticleRepository.getAllNonProcessed({
      createdAt: { lte: marker },
    });
  }

  static async pagedGetAllNonProcessed(pagination?: bg.PaginationType) {
    const articles = await prisma.article.findMany({
      where: { status: VO.ArticleStatusEnum.ready },
      select: {
        id: true,
        url: true,
        source: true,
        title: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      ...pagination,
    });

    return articles.map((article) => ({
      ...article,
      createdAt: {
        raw: article.createdAt,
        relative: bg.DateFormatters.relative(article.createdAt),
      },
    }));
  }

  static async getNumberOfNonProcessed() {
    return prisma.article.count({
      where: { status: VO.ArticleStatusEnum.ready },
    });
  }

  static async getFavourite() {
    return prisma.article.findMany({
      where: { favourite: true, status: { not: VO.ArticleStatusEnum.deleted } },
      orderBy: { favouritedAt: "asc" },
      select: { id: true, url: true, title: true },
    });
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
}
