import * as bg from "@bgord/node";
import Parser from "rss-parser";
import _ from "lodash";

import * as Services from "../services";
import * as VO from "../value-objects";
import * as Newspapers from "../../newspapers";
import * as Repos from "../repositories";
import * as infra from "../../../infra";

const parser = new Parser({ timeout: bg.Time.Seconds(5).ms });

export type RSSItemType = bg.AsyncReturnType<
  Parser["parseString"]
>["items"][number];

export class RSSCrawlerJob {
  private constructor(
    readonly id: bg.Schema.UUIDType,
    readonly url: Newspapers.VO.ArticleUrlType,
    readonly sourceId: VO.SourceIdType,
    readonly status: "new" | "done" = "new"
  ) {}

  static async build(_id: bg.Schema.UUIDType) {}

  static async create(
    url: Newspapers.VO.ArticleUrlType,
    sourceId: VO.SourceIdType
  ) {
    return new RSSCrawlerJob(bg.NewUUID.generate(), url, sourceId);
  }

  static async exists(
    _url: Newspapers.VO.ArticleUrlType,
    _sourceId: VO.SourceIdType
  ): Promise<boolean> {
    return false;
  }
}

export class RSSCrawlerJobFactory {
  static async create(
    item: bg.AsyncReturnType<Parser["parseString"]>["items"][number],
    sourceId: VO.SourceIdType
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

export class RSSCrawler {
  static INTERVAL_MINUTES = 2;

  static async crawl() {
    const sources = await Repos.SourceRepository.listActive();

    const stepper = new bg.Stepper({ total: sources.length });

    for (const source of sources) {
      try {
        const rss = await parser.parseURL(source.url);

        const metadata = Services.SourceMetadataUpdater.map(rss.items);
        await Services.SourceMetadataUpdater.update(source.id, metadata);

        await Promise.all(
          rss.items.map((item) => RSSCrawlerJobFactory.create(item, source.id))
        );
      } catch (error) {
        infra.logger.info({
          message: "Crawling RSS error",
          operation: "rss_crawler_error",
          metadata: {
            source: source.url,
            error: infra.logger.formatError(error),
          },
        });
      }

      stepper.continue();
    }
  }
}
