import * as z from "zod";
import * as bg from "@bgord/node";
import _ from "lodash";

import * as VO from "../value-objects";
import * as infra from "../../../infra";

export const ArchiveArticlesFilter = new bg.Filter(
  z.object({
    status: VO.ArticleStatus.optional(),
    source: VO.ArticleSource.optional(),
    createdAt: VO.TimeStampFilter,
  })
);

export class ArticleRepository {
  static async getAll(filters?: infra.Prisma.ArticleWhereInput) {
    return infra.db.article.findMany({
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

  static async getAllNonProcessed(filters?: infra.Prisma.ArticleWhereInput) {
    const articles = await infra.db.article.findMany({
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
      createdAt: bg.RelativeDate.truthy(article.createdAt),
    }));
  }

  static async getOld(marker: VO.ArticleOldMarkerType) {
    return ArticleRepository.getAllNonProcessed({ createdAt: { lte: marker } });
  }

  static async pagedGetAllNonProcessed(pagination: bg.PaginationType) {
    const where = { status: VO.ArticleStatusEnum.ready };

    const [total, articles] = await infra.db.$transaction([
      infra.db.article.count({ where }),
      infra.db.article.findMany({
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
      createdAt: bg.RelativeDate.truthy(article.createdAt),
    }));

    return bg.Pagination.prepare({ total, pagination, result });
  }

  static async getNumberOfNonProcessed() {
    return infra.db.article.count({
      where: { status: VO.ArticleStatusEnum.ready },
    });
  }

  static async create(
    article: Pick<VO.ArticleType, "id" | "url" | "source" | "createdAt"> & {
      title: VO.ArticleMetatagsType["title"];
    }
  ) {
    return infra.db.article.create({
      data: { ...article, status: VO.ArticleStatusEnum.ready },
    });
  }

  static async updateStatus(
    id: VO.ArticleType["id"],
    status: VO.ArticleType["status"]
  ) {
    return infra.db.article.updateMany({ where: { id }, data: { status } });
  }

  static async assignToNewspaper(
    articleId: VO.ArticleType["id"],
    newspaperId: VO.NewspaperType["id"]
  ) {
    return infra.db.article.update({
      where: { id: articleId },
      data: { newspaperId },
    });
  }

  static async getNumbersOfNonProcessedArticlesWithUrl(
    url: VO.ArticleType["url"]
  ) {
    return infra.db.article.count({
      where: { url, status: VO.ArticleStatusEnum.ready },
    });
  }

  static async getNumbersOfArticlesWithUrl(url: VO.ArticleType["url"]) {
    return infra.db.article.count({ where: { url } });
  }

  static async search(query: VO.ArticleSearchQueryType) {
    const isQueryAnUrlCheck = VO.ArticleUrl.safeParse(query);

    const articles = await infra.db.article.findMany({
      where: {
        status: VO.ArticleStatusEnum.ready,
        [isQueryAnUrlCheck.success ? "url" : "title"]: { contains: query },
      },
      select: {
        id: true,
        url: true,
        source: true,
        title: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return articles.map((article) => ({
      ...article,
      createdAt: bg.RelativeDate.truthy(article.createdAt),
    }));
  }
}
