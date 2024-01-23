import * as bg from "@bgord/node";
import { callLimit as plimit } from "promise-call-limit";

import * as Newspapers from "../../newspapers";

import * as Services from "../services";
import * as Repos from "../repositories";
import { RSSCrawlerJob } from "./rss-crawler";

import * as infra from "../../../infra";

export class RssCrawlerJobProcessor {
  static readonly INTERVAL_MINUTES = 1;

  static readonly PROCESSING_JOBS_BATCH_LIMIT = 200;

  static async process() {
    const ids = await Repos.RssCrawlerJobRepository.listReady(
      RssCrawlerJobProcessor.PROCESSING_JOBS_BATCH_LIMIT,
    );

    infra.logger.info({
      message: `Received ${ids.length} ready jobs`,
      operation: "rss_crawler_job_processor_workload",
    });

    const jobs = ids.map(
      (job) => () =>
        RSSCrawlerJob.build(job.id).then(async (job) => {
          try {
            await Newspapers.Aggregates.Article.add({
              url: job.url,
              source: Newspapers.VO.ArticleSourceEnum.rss,
            });
            await job.process(new bg.Revision(job.revision));

            const source = await Services.Source.build(job.sourceId);
            const sourceRevision = new bg.Revision(source.data.revision);
            await source.bump(sourceRevision);
          } catch (error) {
            await job.fail(new bg.Revision(job.revision));
          } finally {
            infra.ResponseCache.flushAll();
          }
        }),
    );

    await plimit(jobs, { limit: 25 });
  }
}
