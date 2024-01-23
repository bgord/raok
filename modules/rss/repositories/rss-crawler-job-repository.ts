import * as bg from "@bgord/node";
import _ from "lodash";

import * as infra from "../../../infra";
import { RSSCrawlerJobStatusEnum } from "../services/rss-crawler";

export class RssCrawlerJobRepository {
  static async create(
    payload: Omit<infra.RssCrawlerJob, "createdAt" | "updatedAt" | "revision">,
  ) {
    const now = Date.now();

    await infra.db.rssCrawlerJob.create({
      data: {
        ...payload,
        createdAt: now,
        updatedAt: now,
        revision: bg.Revision.initial,
      },
    });
  }

  static async listReady(limit: number) {
    return infra.db.rssCrawlerJob.findMany({
      where: { status: "ready" },
      select: { id: true, revision: true },
      take: limit,
    });
  }

  static async getById(id: infra.RssCrawlerJob["id"]) {
    return infra.db.rssCrawlerJob.findUnique({ where: { id } });
  }

  static async updateStatus(
    id: infra.RssCrawlerJob["id"],
    status: RSSCrawlerJobStatusEnum,
    revision: infra.RssCrawlerJob["revision"],
  ) {
    await infra.db.rssCrawlerJob.update({
      where: { id },
      data: { status, revision, updatedAt: Date.now() },
    });
  }

  static async count(
    where: Pick<infra.RssCrawlerJob, "url" | "sourceId">,
  ): Promise<number> {
    return infra.db.rssCrawlerJob.count({ where });
  }
}
