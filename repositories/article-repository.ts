import * as z from "zod";
import * as bg from "@bgord/node";
import _ from "lodash";

import { Prisma, db } from "../db";
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
        status: true,
      },
      where: filters,
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

    const [total, articles] = await db.$transaction([
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

  static async create(
    article: Pick<VO.ArticleType, "id" | "url" | "source" | "createdAt"> & {
      title: VO.ArticleMetatagsType["title"];
    }
  ) {
    return db.article.create({
      data: { ...article, status: VO.ArticleStatusEnum.ready },
    });
  }

  static async updateStatus(
    id: VO.ArticleType["id"],
    status: VO.ArticleType["status"]
  ) {
    return db.article.updateMany({ where: { id }, data: { status } });
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

  static async getNumbersOfNonProcessedArticlesWithUrl(
    url: VO.ArticleType["url"]
  ) {
    return db.article.count({
      where: { url, status: VO.ArticleStatusEnum.ready },
    });
  }

  static async getNumbersOfArticlesWithUrl(url: VO.ArticleType["url"]) {
    return db.article.count({
      where: { url, source: VO.ArticleSourceEnum.feedly },
    });
  }
}
