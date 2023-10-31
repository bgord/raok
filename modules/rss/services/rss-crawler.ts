import * as bg from "@bgord/node";
import Parser from "rss-parser";
import _ from "lodash";
import { isWithinInterval, subMonths, startOfToday } from "date-fns";

import * as VO from "../../../value-objects";
import * as Aggregates from "../../../aggregates";
import * as Repos from "../repositories";

import * as infra from "../../../infra";

const LinkCache = new bg.Cache({
  stdTTL: bg.Time.Days(7).seconds,
  checkperiod: bg.Time.Hours(1).seconds,
});

const parser = new Parser({ timeout: bg.Time.Seconds(5).ms });

export class RSSCrawler {
  public static INTERVAL_MINUTES = 2;

  public static PROCESSING_URLS_BATCH = 50;

  urls: VO.ArticleUrlType[] = [];

  public async crawl() {
    const sources = await Repos.SourceRepository.list();

    const urls: VO.ArticleUrlType[] = [];

    infra.logger.info({
      message: "Starting RSS crawl",
      operation: "rss_crawler_start",
    });

    const stepper = new bg.Stepper({ total: sources.length });

    for (const source of sources) {
      try {
        const rss = await parser.parseURL(source.url);

        infra.logger.info({
          message: `Crawling RSS success ${stepper.format()}`,
          operation: "rss_crawler_success",
          metadata: { source: source.url, items: rss.items.length },
        });

        for (const item of rss.items) {
          const link = VO.ArticleUrl.safeParse(item.link);

          if (!link.success || !item.link) continue;
          if (!this.isFromLastMonth(item.isoDate)) continue;
          if (LinkCache.has(link.data)) continue;

          urls.push(link.data);
        }
      } catch (error) {
        infra.logger.info({
          message: "Crawling RSS error",
          operation: "rss_crawler_error",
          metadata: {
            source: source.url,
            error: infra.logger.formatError(error),
          },
        });
      } finally {
        stepper.continue();
        await bg.sleep({ ms: bg.Time.Seconds(1).ms });
      }
    }

    this.urls = urls;
  }

  async process() {
    infra.logger.info({
      message: "Trying to add articles",
      operation: "rss_crawler_article_add_description",
      metadata: { urls: this.urls.length },
    });

    const stepper = new bg.Stepper({ total: RSSCrawler.PROCESSING_URLS_BATCH });

    for (const url of this.urls) {
      try {
        await Aggregates.Article.add({ url, source: VO.ArticleSourceEnum.rss });
      } catch (error) {
        infra.logger.error({
          message: `Article not added ${stepper.format()}`,
          operation: "rss_crawler_article_add_error",
          metadata: { url },
        });
      } finally {
        LinkCache.set(url, true);
        if (stepper.isFinished()) break;
        stepper.continue();
        await bg.sleep({ ms: bg.Time.Seconds(1).ms });
      }
    }
  }

  private isFromLastMonth(
    value: bg.AsyncReturnType<Parser["parseString"]>["items"][0]["isoDate"]
  ): boolean {
    if (!value) return true;

    return isWithinInterval(new Date(value), {
      start: subMonths(startOfToday(), 1),
      end: startOfToday(),
    });
  }
}
