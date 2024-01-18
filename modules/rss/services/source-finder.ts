import { JSDOM } from "jsdom";

import * as VO from "../value-objects";
import * as Policies from "../policies";

type SourceCandidateFinderStrategyType = {
  strategy: string;
  isApplicable(value: VO.SourceUrlType): boolean;
  get(value: VO.SourceUrlType): Promise<VO.SourceUrlType[]>;
};

export class SourceCandidateFinderStrategyYouTube {
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
        'link[rel="canonical"]',
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

export class SourceCandidateFinderStrategyDefault {
  static strategy = "default";

  static isApplicable(_value: VO.SourceUrlType): boolean {
    return true;
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

export class SourceCandidatesFinder {
  static find(value: VO.SourceUrlType): SourceCandidateFinderStrategyType {
    const strategies: SourceCandidateFinderStrategyType[] = [
      SourceCandidateFinderStrategyYouTube,
    ];

    return (
      strategies.find((strategy) => strategy.isApplicable(value)) ??
      SourceCandidateFinderStrategyDefault
    );
  }
}

export class SourceFinder {
  private constructor(private readonly candidates: VO.SourceUrlType[]) {}

  static async build(url: VO.SourceUrlType) {
    const strategy = SourceCandidatesFinder.find(url);
    const candidates = await strategy.get(url);

    return new SourceFinder(candidates);
  }

  async find(): Promise<VO.SourceUrlType> {
    const options = this.candidates.map((sourceUrl) =>
      Policies.SourceUrlResponds.perform({ sourceUrl }).then(() => sourceUrl),
    );

    return Promise.any(options).catch(() => {
      throw new Policies.SourceUrlRespondsError();
    });
  }
}
