import * as bg from "@bgord/node";
import _ from "lodash";

import * as VO from "../value-objects";
import * as Newspapers from "../../newspapers";
import * as Repos from "../repositories";

export enum RSSCrawlerJobStatusEnum {
  ready = "ready",
  processed = "processed",
  failed = "failed",
}

export class RSSCrawlerJob {
  private constructor(
    private readonly id: bg.Schema.UUIDType,
    readonly url: Newspapers.VO.ArticleUrlType,
    readonly sourceId: VO.SourceIdType,
    public revision: bg.Revision,
    private status: RSSCrawlerJobStatusEnum = RSSCrawlerJobStatusEnum.ready
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
      job.status as RSSCrawlerJobStatusEnum
    );
  }

  static async create(
    url: Newspapers.VO.ArticleUrlType,
    sourceId: VO.SourceIdType
  ) {
    const id = bg.NewUUID.generate();
    const job = { id, url, sourceId, status: RSSCrawlerJobStatusEnum.ready };

    await Repos.RssCrawlerJobRepository.create(job);

    return new RSSCrawlerJob(
      id,
      url,
      sourceId,
      new bg.Revision(bg.Revision.initial)
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
      revision.next().value
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
      revision.next().value
    );

    this.status = RSSCrawlerJobStatusEnum.failed;
    this.revision = revision.next();
  }

  static async exists(
    url: Newspapers.VO.ArticleUrlType,
    sourceId: VO.SourceIdType
  ): Promise<boolean> {
    const count = await Repos.RssCrawlerJobRepository.count({ url, sourceId });

    return count > 0;
  }
}
