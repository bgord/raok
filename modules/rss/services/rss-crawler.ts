import * as bg from "@bgord/node";
import Parser from "rss-parser";
import _ from "lodash";
import { callLimit as plimit } from "promise-call-limit";

import * as Services from "../services";
import * as VO from "../value-objects";
import * as Newspapers from "../../newspapers";
import * as Repos from "../repositories";
import * as infra from "../../../infra";

const parser = new Parser({ timeout: bg.Time.Seconds(5).ms });

export type RSSItemType = bg.AsyncReturnType<
  Parser["parseString"]
>["items"][number];

export enum RSSCrawlerJobStatusEnum {
  ready = "ready",
  processed = "processed",
  failed = "failed",
}

export class RSSCrawlerJob {
  /* eslint-disable max-params */
  private constructor(
    private readonly id: bg.Schema.UUIDType,
    readonly url: Newspapers.VO.ArticleUrlType,
    readonly sourceId: VO.SourceIdType,
    public revision: bg.Revision,
    private status: RSSCrawlerJobStatusEnum = RSSCrawlerJobStatusEnum.ready,
  ) {}

  static async build(id: bg.Schema.UUIDType): Promise<RSSCrawlerJob> {
    const job = await Repos.RssCrawlerJobRepository.getById(id);

    if (!job) {
      throw new Error("RSS crawler job not found");
    }

    return new RSSCrawlerJob(
      job.id,
      job.url,
      job.sourceId,
      new bg.Revision(job.revision),
      job.status as RSSCrawlerJobStatusEnum,
    );
  }

  static async create(
    url: Newspapers.VO.ArticleUrlType,
    sourceId: VO.SourceIdType,
  ) {
    const id = bg.NewUUID.generate();
    const job = { id, url, sourceId, status: RSSCrawlerJobStatusEnum.ready };

    await Repos.RssCrawlerJobRepository.create(job);

    return new RSSCrawlerJob(
      id,
      url,
      sourceId,
      new bg.Revision(bg.Revision.initial),
    );
  }

  async process(revision: bg.Revision) {
    revision.validate(this.revision.value);

    if (
      [
        RSSCrawlerJobStatusEnum.processed,
        RSSCrawlerJobStatusEnum.failed,
      ].includes(this.status)
    ) {
      throw new Error("Job is already processed");
    }

    await Repos.RssCrawlerJobRepository.updateStatus(
      this.id,
      RSSCrawlerJobStatusEnum.processed,
      revision.next().value,
    );

    this.status = RSSCrawlerJobStatusEnum.processed;
    this.revision = revision.next();
  }

  async fail(revision: bg.Revision) {
    revision.validate(this.revision.value);

    if (
      [
        RSSCrawlerJobStatusEnum.processed,
        RSSCrawlerJobStatusEnum.failed,
      ].includes(this.status)
    ) {
      throw new Error("Job is already processed");
    }

    await Repos.RssCrawlerJobRepository.updateStatus(
      this.id,
      RSSCrawlerJobStatusEnum.failed,
      revision.next().value,
    );

    this.status = RSSCrawlerJobStatusEnum.failed;
    this.revision = revision.next();
  }

  static async exists(
    url: Newspapers.VO.ArticleUrlType,
    sourceId: VO.SourceIdType,
  ): Promise<boolean> {
    const count = await Repos.RssCrawlerJobRepository.count({ url, sourceId });

    return count > 0;
  }
}

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

export class RSSCrawler {
  static INTERVAL_MINUTES = 2;

  static async crawl() {
    const sources = await Repos.SourceRepository.listActive();

    const stepper = new bg.Stepper({ total: sources.length });

    for (const source of sources) {
      try {
        const rss = await parser.parseURL(source.url);

        await Services.SourceMetadataUpdater.update(
          source.id,
          Services.SourceMetadataUpdater.map(rss.items),
        );

        infra.logger.info({
          message: `Crawling RSS success ${stepper.format()}`,
          operation: "rss_crawler_success",
          metadata: { source: source.url, items: rss.items.length },
        });

        const jobs = rss.items.map(
          (item) => () => RSSCrawlerJobFactory.create(item, source.id),
        );

        await plimit(jobs, { limit: 100 });
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
