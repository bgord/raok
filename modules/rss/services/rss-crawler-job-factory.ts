import * as bg from "@bgord/node";
import Parser from "rss-parser";
import _ from "lodash";

import * as VO from "../value-objects";
import * as Newspapers from "../../newspapers";

import { RSSCrawlerJob } from "./rss-crawler-job";

export class RSSCrawlerJobFactory {
  static async create(
    item: bg.AsyncReturnType<Parser["parseString"]>["items"][number],
    sourceId: VO.SourceIdType,
  ): Promise<RSSCrawlerJob | null> {
    try {
      const url = Newspapers.VO.ArticleUrl.safeParse(item.link);
      const createdAt = new VO.SourceItemCreatedAt(item.isoDate);

      if (!url.success) return null;
      if (!createdAt.isAcceptable()) return null;
      if (await RSSCrawlerJob.exists(url.data, sourceId)) return null;

      return RSSCrawlerJob.create(url.data, sourceId);
    } catch (error) {
      return null;
    }
  }
}
