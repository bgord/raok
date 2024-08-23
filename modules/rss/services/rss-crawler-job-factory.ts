import * as bg from "@bgord/node";
import Parser from "rss-parser";
import _ from "lodash";

import * as VO from "../value-objects";
import * as Newspapers from "../../newspapers";

import { RSSCrawlerJob } from "./rss-crawler-job";

export class RSSCrawlerJobFactory {
  static async create(
    item: Awaited<ReturnType<Parser["parseString"]>>["items"][number],
    source: Pick<VO.SourceType, "id"> & { processedUntil: bg.RelativeDateType },
  ): Promise<RSSCrawlerJob | null> {
    try {
      const url = Newspapers.VO.ArticleUrl.safeParse(item.link);
      const createdAt = new VO.SourceItemCreatedAt(item.isoDate);

      if (!url.success) return null;
      if (!createdAt.isAcceptable(source.processedUntil)) return null;
      if (await RSSCrawlerJob.exists(url.data, source.id)) return null;

      return RSSCrawlerJob.create(url.data, source.id);
    } catch (error) {
      return null;
    }
  }
}
