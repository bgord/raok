import * as bg from "@bgord/node";
import { callLimit as plimit } from "promise-call-limit";

import * as Newspapers from "../../newspapers";
import * as Repos from "../repositories";
import { Source, RSSCrawlerJob } from "../services";

import * as infra from "../../../infra";

export class RssCrawlerJobProcessor {
  static readonly INTERVAL_MINUTES = 1;

  static readonly PROCESSING_JOBS_BATCH_LIMIT = 200;

  static async process() {
    const ids = await Repos.RssCrawlerJobRepository.listReady(
      RssCrawlerJobProcessor.PROCESSING_JOBS_BATCH_LIMIT
    );

    infra.logger.info({
      message: `Received ${ids.length} ready jobs`,
      operation: "rss_crawler_job_processor_workload",
    });

    const jobs = ids.map(
      (job) => () =>
        RSSCrawlerJob.build(job.id).then(async (job) => {
          try {
            const article = {
              url: job.url,
              source: Newspapers.VO.ArticleSourceEnum.rss,
            };

            const source = await Source.build(job.sourceId);
            const revision = new bg.Revision(source.data.revision);

            await Newspapers.Aggregates.Article.add(article, source.data);
            await job.process(job.revision);

            await source.bump(revision);
          } catch (error) {
            await job.fail(job.revision);
          } finally {
            infra.ResponseCache.flushAll();
          }
        })
    );

    await plimit(jobs, { limit: 25 });
  }
}
