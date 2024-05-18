import { JSDOM } from "jsdom";

import * as VO from "../value-objects";
import * as Policies from "../policies";

type SourceCandidateFinderStrategyType = {
  strategy: string;
  isApplicable(value: VO.SourceUrlType): boolean;
  get(value: VO.SourceUrlType): Promise<VO.SourceUrlType[]>;
};

class SourceCandidateFinderStrategyYouTube {
  static strategy = "default";

  static isApplicable(value: VO.SourceUrlType): boolean {
    try {
      const url = new URL(value);

      return url.origin === "https://www.youtube.com";
    } catch (error) {
      return false;
    }
  }

  static async get(value: VO.SourceUrlType): Promise<VO.SourceUrlType[]> {
    try {
      const result = await fetch(value, { method: "GET" });
      const response = await result.text();

      const dom = new JSDOM(response);

      const linkTag = dom.window.document.querySelector(
        'link[rel="canonical"]'
      );

      const url = linkTag?.getAttribute("href");

      if (!url) return [value];

      const channelId = new URL(url).pathname.split("/")[2];

      if (!channelId) return [value];

      return [
        `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
      ];
    } catch (error) {
      return [value];
    }
  }
}

class SourceCandidateFinderStrategyAutoDiscovery {
  static strategy = "auto_discovery";

  static isApplicable(value: VO.SourceUrlType): boolean {
    try {
      const url = new URL(value);
      return url.origin !== "https://www.youtube.com";
    } catch (error) {
      return false;
    }
  }

  static async get(value: VO.SourceUrlType): Promise<VO.SourceUrlType[]> {
    try {
      const result = await fetch(value, { method: "GET" });
      const response = await result.text();

      const dom = new JSDOM(response);

      const linkTag = dom.window.document.querySelector(
        'link[type="application/rss+xml"]'
      );

      const href = linkTag?.getAttribute("href");
      if (!href) return [value];

      const candidate = new URL(value);
      candidate.pathname = href;

      return [candidate.toString()];
    } catch (error) {
      return [value];
    }
  }
}

class SourceCandidateFinderStrategyDefault {
  static strategy = "default";

  static isApplicable(value: VO.SourceUrlType): boolean {
    const url = new URL(value);

    return url.origin !== "https://www.youtube.com";
  }

  static async get(value: VO.SourceUrlType): Promise<VO.SourceUrlType[]> {
    const base = new URL(value);

    return [
      value,
      `${base.origin}/rss`,
      `${base.origin}/rss.xml`,
      `${base.origin}/feed`,
      `${base.origin}/feed.xml`,
      `${base.origin}/index.xml`,
      `${base.origin}/atom.xml`,
      `${base.origin}/feeds.xml`,
      `${base.origin}/blog/rss.xml`,
    ];
  }
}

class SourceCandidatesFinder {
  static find(value: VO.SourceUrlType): SourceCandidateFinderStrategyType[] {
    const strategies: SourceCandidateFinderStrategyType[] = [
      SourceCandidateFinderStrategyAutoDiscovery,
      SourceCandidateFinderStrategyYouTube,
      SourceCandidateFinderStrategyDefault,
    ];

    return strategies.filter((strategy) => strategy.isApplicable(value));
  }
}

export class SourceFinder {
  private constructor(private readonly candidates: VO.SourceUrlType[]) {}

  static async build(url: VO.SourceUrlType) {
    const strategies = SourceCandidatesFinder.find(url);

    const candidates = await Promise.all(
      strategies.map((strategy) => strategy.get(url))
    );

    return new SourceFinder(candidates.flat());
  }

  async find(): Promise<VO.SourceUrlType> {
    const options = this.candidates.map((sourceUrl) =>
      Policies.SourceUrlResponds.perform({ sourceUrl }).then(() => sourceUrl)
    );

    return Promise.any(options).catch(() => {
      throw new Policies.SourceUrlRespondsError();
    });
  }
}
