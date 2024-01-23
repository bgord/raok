import * as bg from "@bgord/node";
import { callLimit as plimit } from "promise-call-limit";

import * as Newspapers from "../../newspapers";

import * as Services from "../services";
import * as Repos from "../repositories";
import { RSSCrawlerJob } from "./rss-crawler-v2";

import * as infra from "../../../infra";

export class RssCrawlerJobProcessorV2 {
  static readonly INTERVAL_MINUTES = 1;

  static readonly PROCESSING_JOBS_BATCH_LIMIT = 200;

  static async process() {
    const ids = await Repos.RssCrawlerJobRepository.listReady(
      RssCrawlerJobProcessorV2.PROCESSING_JOBS_BATCH_LIMIT,
    );

    infra.logger.info({
      message: `Received ${ids.length} ready jobs`,
      operation: "rss_crawler_job_processor_workload",
    });

    const stepper = new bg.Stepper({ total: ids.length });

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
            infra.logger.error({
              message: `Article not added ${stepper.format()}`,
              operation: "rss_crawl_job_processor_article_add_error",
              metadata: { job },
            });
          } finally {
            infra.ResponseCache.flushAll();
            stepper.continue();
          }
        }),
    );

    await plimit(jobs, { limit: 25 });
  }
}
