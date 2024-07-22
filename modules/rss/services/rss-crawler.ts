import _ from "lodash";
import { callLimit as plimit } from "promise-call-limit";

import * as Repos from "../repositories";
import * as infra from "../../../infra";
import {
  RSSCrawlerJobFactory,
  SourceMetadataUpdater,
  RSSDownloader,
} from "../services";

export class RSSCrawler {
  static INTERVAL_MINUTES = 60;

  static async crawl() {
    const sources = await Repos.SourceRepository.listActive();

    for (const source of sources) {
      try {
        const rss = await RSSDownloader.download(source.url);

        await SourceMetadataUpdater.update(
          source.id,
          SourceMetadataUpdater.map(rss),
        );

        const jobs = rss.map(
          (item) => () => RSSCrawlerJobFactory.create(item, source),
        );

        infra.logger.info({
          message: `Received ${jobs.length} job candidates`,
          operation: "rss_crawler_job_candidates_workload",
          metadata: { source: source.url },
        });

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
    }
  }
}
