import * as z from "zod";
import * as bg from "@bgord/node";
import _ from "lodash";

import { Prisma, db } from "../db";
import * as Services from "../services";
import * as VO from "../value-objects";

export const ArchiveArticlesFilter = new bg.Filter(
  z.object({
    status: VO.ArticleStatus.optional(),
    source: VO.ArticleSource.optional(),
    createdAt: VO.TimeStampFilter,
  })
);

export class ArticleRepository {
  static async getAll(filters?: Prisma.ArticleWhereInput) {
    return db.article.findMany({
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
    const articles = await db.article.findMany({
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
      createdAt: bg.ComplexDate.truthy(article.createdAt),
    }));
  }

  static async getOld(marker: VO.ArticleOldMarkerType) {
    return ArticleRepository.getAllNonProcessed({ createdAt: { lte: marker } });
  }

  static async pagedGetAllNonProcessed(pagination: bg.PaginationType) {
    const where = { status: VO.ArticleStatusEnum.ready };

    const [total, articles] = await Promise.all([
      db.article.count({ where }),
      db.article.findMany({
        where,
        select: {
          id: true,
          url: true,
          source: true,
          title: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        ...pagination.values,
      }),
    ]);

    const result = articles.map((article) => ({
      ...article,
      createdAt: bg.ComplexDate.truthy(article.createdAt),
    }));

    return bg.Pagination.prepare({ total, pagination, result });
  }

  static async getNumberOfNonProcessed() {
    return db.article.count({
      where: { status: VO.ArticleStatusEnum.ready },
    });
  }

  static async getFavourite() {
    return db.article.findMany({
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
    return db.article.create({
      data: { ...article, status: VO.ArticleStatusEnum.ready },
    });
  }

  static async updateStatus(
    articleId: VO.ArticleType["id"],
    status: VO.ArticleType["status"]
  ) {
    return db.article.updateMany({
      where: { id: articleId },
      data: { status },
    });
  }

  static async addToFavourites(articleId: VO.ArticleType["id"]) {
    return db.article.update({
      where: { id: articleId },
      data: { favourite: true, favouritedAt: Date.now() },
    });
  }

  static async deleteFromFavourites(articleId: VO.ArticleType["id"]) {
    return db.article.update({
      where: { id: articleId },
      data: { favourite: false },
    });
  }

  static async assignToNewspaper(
    articleId: VO.ArticleType["id"],
    newspaperId: VO.NewspaperType["id"]
  ) {
    return db.article.update({
      where: { id: articleId },
      data: { newspaperId },
    });
  }

  static async delete(articleId: VO.ArticleType["id"]) {
    return db.article.delete({ where: { id: articleId } });
  }

  static async getNumbersOfNonProcessedArticlesWithUrl(
    articleUrl: VO.ArticleType["url"]
  ) {
    return db.article.count({
      where: { url: articleUrl, status: VO.ArticleStatusEnum.ready },
    });
  }

  static async getNumbersOfArticlesWithUrl(articleUrl: VO.ArticleType["url"]) {
    return db.article.count({
      where: { url: articleUrl, source: VO.ArticleSourceEnum.feedly },
    });
  }
}
