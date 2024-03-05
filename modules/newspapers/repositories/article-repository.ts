import * as z from "zod";
import * as bg from "@bgord/node";
import _ from "lodash";

import * as Services from "../services";
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
  static async pagedGetAll(
    pagination: bg.PaginationType,
    search: VO.ArticleArchiveSearchQueryType,
    filters?: infra.Prisma.ArticleWhereInput
  ) {
    const where = { ...filters, title: { contains: search } };

    const [total, articles] = await infra.db.$transaction([
      infra.db.article.count({ where }),
      infra.db.article.findMany({
        orderBy: { createdAt: "desc" },
        where,
        ...pagination.values,
      }),
    ]);

    return bg.Pagination.prepare({
      total,
      pagination,
      result: articles.map((article) =>
        ArticleRepository._map(
          article as infra.Article & { RssSource: infra.Source }
        )
      ),
    });
  }

  static async pagedGetAllNonProcessed(pagination: bg.PaginationType) {
    const where = { status: VO.ArticleStatusEnum.ready };

    const [total, articles] = await infra.db.$transaction([
      infra.db.article.count({ where }),
      infra.db.article.findMany({
        where,
        include: { RssSource: true },
        orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
        ...pagination.values,
      }),
    ]);

    return bg.Pagination.prepare({
      total,
      pagination,
      result: articles.map((article) =>
        ArticleRepository._map(
          article as infra.Article & { RssSource: infra.Source }
        )
      ),
    });
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
    payload: Pick<VO.ArticleType, "id" | "status" | "revision">
  ) {
    return infra.db.article.updateMany({
      where: { id: payload.id },
      data: { status: payload.status, revision: payload.revision },
    });
  }

  static async assignToNewspaper(
    articleId: VO.ArticleType["id"],
    newspaperId: VO.NewspaperType["id"],
    revision: VO.ArticleType["revision"]
  ) {
    return infra.db.article.update({
      where: { id: articleId },
      data: { newspaperId, revision },
    });
  }

  static async updateReadingTime(
    payload: Pick<VO.ArticleType, "id" | "estimatedReadingTimeInMinutes">
  ) {
    return infra.db.article.update({
      where: { id: payload.id },
      data: {
        estimatedReadingTimeInMinutes: payload.estimatedReadingTimeInMinutes,
      },
    });
  }

  static async updateRating(payload: Pick<VO.ArticleType, "id" | "rating">) {
    return infra.db.article.update({
      where: { id: payload.id },
      data: { rating: payload.rating },
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
      orderBy: { createdAt: "desc" },
    });

    return articles.map((article) =>
      ArticleRepository._map(
        article as infra.Article & { RssSource: infra.Source }
      )
    );
  }

  static async getSingle(id: VO.ArticleIdType) {
    return infra.db.article.findFirst({ where: { id } });
  }

  static _map(article: infra.Article & { RssSource: infra.Source }) {
    return {
      ...article,
      RssSource: article.RssSource,
      createdAt: bg.RelativeDate.truthy(Number(article.createdAt)),
      rating: Services.ArticleRatingLevelCalculator.calculate(article.rating),
    };
  }
}
