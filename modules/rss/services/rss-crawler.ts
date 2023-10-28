import * as bg from "@bgord/node";
import Parser from "rss-parser";

import * as VO from "../../../value-objects";
import * as Aggregates from "../../../aggregates";

import * as infra from "../../../infra";

export class RSSCrawler {
  public static INTERVAL_MINUTES = 5;

  constructor() {}

  public async crawl() {
    const sources = await this.getSources();

    const urls: VO.ArticleUrlType[] = [];

    for (const source of sources) {
      try {
        const rss = await new Parser().parseURL(source);

        infra.logger.info({
          message: "Crawling RSS success",
          operation: "rss_crawler_success",
          metadata: { source, items: rss.items.length },
        });

        for (const item of rss.items) {
          const link = VO.ArticleUrl.safeParse(item.link);

          if (!link.success) {
            infra.logger.warn({
              message: "Invalid article URL received from RSS",
              operation: "rss_crawler_article_url_invalid",
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

    infra.logger.info({
      message: "Trying to add articles",
      operation: "rss_crawler_article_add_description",
      metadata: { urls: urls.length },
    });

    // for (const url of urls) {
    //   try {
    //     await Aggregates.Article.add({ url, source: VO.ArticleSourceEnum.rss });

    //     infra.logger.info({
    //       message: "Article added",
    //       operation: "rss_crawler_article_add_success",
    //       metadata: { url },
    //     });
    //   } catch (error) {
    //     infra.logger.error({
    //       message: "Article not added",
    //       operation: "rss_crawler_article_add_error",
    //       metadata: { url, error: infra.logger.formatError(error) },
    //     });
    //   }
    // }
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
