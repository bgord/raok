import * as bg from "@bgord/node";
import Parser from "rss-parser";
import _ from "lodash";
import { callLimit as plimit } from "promise-call-limit";

import * as Repos from "../repositories";
import * as infra from "../../../infra";
import { RSSCrawlerJobFactory, SourceMetadataUpdater } from "../services";

const parser = new Parser({ timeout: bg.Time.Seconds(5).ms });

export class RSSCrawler {
  static INTERVAL_MINUTES = 2;

  static async crawl() {
    const sources = await Repos.SourceRepository.listActive();

    for (const source of sources) {
      try {
        const rss = await parser.parseURL(source.url);

        await SourceMetadataUpdater.update(
          source.id,
          SourceMetadataUpdater.map(rss.items)
        );

        const jobs = rss.items.map(
          (item) => () => RSSCrawlerJobFactory.create(item, source)
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
