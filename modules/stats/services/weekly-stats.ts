import * as bg from "@bgord/node";

import * as Events from "../../newspapers/events";
import * as infra from "../../../infra";
import { WeeklyStatsRange } from "./weekly-stats-range";

type WeeklyStatsValueType = {
  articlesAdded: number;
  articlesAddedPerDay: number;
  articlesProcessed: number;
  articlesRead: number;
  articlesOpened: number;
  articlesDeleted: number;
};

export class WeeklyStats {
  private constructor(readonly value: WeeklyStatsValueType) {}

  static async build(range: WeeklyStatsRange): Promise<WeeklyStats> {
    const articlesAdded = await infra.db.event.count({
      where: {
        name: Events.ARTICLE_ADDED_EVENT,
        createdAt: { gte: new Date(range.from) },
      },
    });

    const stats = {
      articlesAdded,
      articlesAddedPerDay: new bg.RoundToNearest().round(articlesAdded / 7),
      articlesProcessed: await infra.db.event.count({
        where: {
          name: Events.ARTICLE_PROCESSED_EVENT,
          createdAt: { gte: new Date(range.from) },
        },
      }),
      articlesRead: await infra.db.event.count({
        where: {
          name: Events.ARTICLE_READ_EVENT,
          createdAt: { gte: new Date(range.from) },
        },
      }),
      articlesOpened: await infra.db.event.count({
        where: {
          name: Events.ARTICLE_OPENED_EVENT,
          createdAt: { gte: new Date(range.from) },
        },
      }),
      articlesDeleted: await infra.db.event.count({
        where: {
          name: Events.ARTICLE_DELETED_EVENT,
          createdAt: { gte: new Date(range.from) },
        },
      }),
    };

    return new WeeklyStats(stats);
  }
}
