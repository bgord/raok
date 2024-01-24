import * as bg from "@bgord/node";
import Parser from "rss-parser";
import _ from "lodash";
import { callLimit as plimit } from "promise-call-limit";

import * as Services from "../services";
import * as Repos from "../repositories";
import * as infra from "../../../infra";

const parser = new Parser({ timeout: bg.Time.Seconds(5).ms });

export class RSSCrawler {
  static INTERVAL_MINUTES = 2;

  static async crawl() {
    const sources = await Repos.SourceRepository.listActive();

    for (const source of sources) {
      try {
        const rss = await parser.parseURL(source.url);

        await Services.SourceMetadataUpdater.update(
          source.id,
          Services.SourceMetadataUpdater.map(rss.items)
        );

        const jobs = rss.items.map(
          (item) => () => Services.RSSCrawlerJobFactory.create(item, source.id)
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
