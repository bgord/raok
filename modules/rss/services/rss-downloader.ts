import * as bg from "@bgord/node";
import Parser from "rss-parser";

import * as VO from "../value-objects";

export class RSSDownloader {
  static parser = new Parser({ timeout: bg.Time.Seconds(5).ms });

  static async download(url: VO.SourceUrlType) {
    const rss = await RSSDownloader.parser.parseURL(url);

    return rss.items;
  }
}
