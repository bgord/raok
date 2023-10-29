import * as bg from "@bgord/node";
import Parser from "rss-parser";
import _ from "lodash";
import { createHash } from "node:crypto";

import * as VO from "../../../value-objects";
import * as Aggregates from "../../../aggregates";

import * as infra from "../../../infra";

const LinkCache = new bg.Cache({
  stdTTL: bg.Time.Days(7).seconds,
  checkperiod: bg.Time.Hours(1).seconds,
});

const SourceCache = new bg.Cache({
  stdTTL: bg.Time.Days(1).seconds,
  checkperiod: bg.Time.Hours(1).seconds,
});

const parser = new Parser({ timeout: bg.Time.Seconds(5).ms });

export class RSSCrawler {
  public static INTERVAL_MINUTES = 5;

  urls: VO.ArticleUrlType[] = [];

  public async crawl() {
    const sources = await this.getSources();
    const urls: VO.ArticleUrlType[] = [];

    infra.logger.info({
      message: "Starting RSS crawl",
      operation: "rss_crawler_start",
    });

    let sourceIndex = 1;

    for (const source of sources) {
      if (sourceIndex > 3) break;

      try {
        infra.logger.info({
          message: `Crawling RSS attempt ${sourceIndex}/${sources.length}`,
          operation: "rss_crawler_attempt",
          metadata: { source },
        });

        const rss = await parser.parseURL(source);

        infra.logger.info({
          message: `Crawling RSS success ${sourceIndex}/${sources.length}`,
          operation: "rss_crawler_success",
          metadata: { source, items: rss.items.length },
        });

        const hash = createHash("sha256")
          .update(JSON.stringify(rss.items))
          .digest("hex");

        if (SourceCache.get(source) === hash) {
          infra.logger.info({
            message: `Skipping cached source ${sourceIndex}/${sources.length}`,
            operation: "rss_crawler_source_skipped_from_cache",
            metadata: { source },
          });

          continue;
        }

        SourceCache.set(source, hash);

        for (const item of rss.items) {
          const link = VO.ArticleUrl.safeParse(item.link);

          if (!link.success || !item.link) {
            infra.logger.warn({
              message: "Invalid article URL received from RSS",
              operation: "rss_crawler_article_url_invalid",
              metadata: { url: item.link, source },
            });

            continue;
          }

          if (LinkCache.has(link.data)) {
            infra.logger.info({
              message: "Skipping cached article",
              operation: "rss_crawler_article_url_skipped_from_cache",
              metadata: { url: item.link, source },
            });

            continue;
          }

          urls.push(link.data);
        }

        sourceIndex++;
        await bg.sleep({ ms: bg.Time.Seconds(1).ms });
      } catch (error) {
        infra.logger.info({
          message: "Crawling RSS error",
          operation: "rss_crawler_error",
          metadata: { source, error: infra.logger.formatError(error) },
        });

        sourceIndex++;
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

    let urlIndex = 1;

    for (const url of this.urls) {
      if (urlIndex > 25) break;

      try {
        infra.logger.info({
          message: `Article add attempt ${urlIndex}/${this.urls.length}`,
          operation: "rss_crawler_article_add_attempt",
          metadata: { url },
        });

        await Aggregates.Article.add({ url, source: VO.ArticleSourceEnum.rss });

        infra.logger.info({
          message: `Article added ${urlIndex}/${this.urls.length}`,
          operation: "rss_crawler_article_add_success",
          metadata: { url },
        });

        LinkCache.set(url, true);
        urlIndex++;
        await bg.sleep({ ms: bg.Time.Seconds(1).ms });
      } catch (error) {
        infra.logger.error({
          message: `Article not added ${urlIndex}/${this.urls.length}`,
          operation: "rss_crawler_article_add_error",
          metadata: { url },
        });
        await bg.sleep({ ms: bg.Time.Seconds(1).ms });
        urlIndex++;
      }
    }

    infra.logger.info({
      message: "Finished adding articles",
      operation: "rss_crawler_article_add_finished",
      metadata: { total: urlIndex },
    });
  }

  private async getSources() {
    return [
      "http://www.bram.us/feed/",
      "http://feeds.feedburner.com/niebezpiecznik/",
      "https://psyche.co/feed",
      "http://feedpress.me/hacker-news-best",
      "http://atlasobscura.com/blog/rss.xml",
      "http://feeds.feedburner.com/bigthink/main",
      "http://geteventstore.com/blog/feed/",
      "https://www.builder.io/blog/feed.xml",
      "https://controlaltbackspace.org/feed.xml",
      "https://cuddly-octo-palm-tree.com/feed.xml",
      "https://overreacted.io/rss.xml",
      "http://danslimmon.wordpress.com/feed/",
      "https://diracdeltas.github.io/blog/index.xml",
      "https://event-driven.io/rss.xml",
      "https://explained-from-first-principles.com/feed.xml",
      "https://frontendmastery.com/feed/",
      "https://www.midline.pl/rss/",
      "http://feeds.feedburner.com/arkency.xml",
      "http://martinfowler.com/bliki/bliki.atom",
      "https://www.youtube.com/feeds/videos.xml?channel_id=UCtcUMxUSMWUNBfOaKUv5cjg",
      "http://www.quantamagazine.org/feed/",
      "https://reactjs.org/feed.xml",
      "http://feeds.feedburner.com/depesz",
      "https://buttondown.email/stately/rss",
      "https://www.swyx.io/rss.xml",
      "https://www.brainpickings.org/feed/",
    ];
  }
}
