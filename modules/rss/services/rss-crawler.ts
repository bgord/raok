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

    for (const source of sources) {
      try {
        const rss = await new Parser().parseURL(source);

        infra.logger.info({
          message: "Crawling RSS success",
          operation: "rss_crawler_success",
          metadata: { source, items: rss.items.length },
        });

        const hash = createHash("sha256")
          .update(JSON.stringify(rss.items))
          .digest("hex");

        if (SourceCache.get(source) === hash) {
          infra.logger.info({
            message: "Skipping cached source",
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
      } catch (error) {
        infra.logger.info({
          message: "Crawling RSS error",
          operation: "rss_crawler_error",
          metadata: { source, error: infra.logger.formatError(error) },
        });
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

    let index = 1;

    for (const url of this.urls) {
      try {
        infra.logger.info({
          message: `Article add attempt ${index}/${this.urls.length}`,
          operation: "rss_crawler_article_add_attempt",
          metadata: { url },
        });

        await Aggregates.Article.add({ url, source: VO.ArticleSourceEnum.rss });

        infra.logger.info({
          message: `Article added ${index}/${this.urls.length}`,
          operation: "rss_crawler_article_add_success",
          metadata: { url },
        });

        LinkCache.set(url, true);
        await bg.sleep({ ms: bg.Time.Seconds(1).ms });
      } catch (error) {
        infra.logger.error({
          message: `Article not added ${index}/${this.urls.length}`,
          operation: "rss_crawler_article_add_error",
          metadata: { url },
        });
      } finally {
        if (index === 50) break;

        index++;
        await bg.sleep({ ms: bg.Time.Seconds(1).ms });
      }
    }

    infra.logger.info({
      message: "Finished adding articles",
      operation: "rss_crawler_article_add_finished",
      metadata: { total: index },
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
