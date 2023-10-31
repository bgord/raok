import * as VO from "../value-objects";
import * as Policies from "../policies";

export class SourceFinder {
  private urls: VO.SourceUrlType[];

  constructor(url: VO.SourceUrlType) {
    this.urls = this.generate(url);
  }

  async find(): Promise<VO.SourceUrlType> {
    try {
      const options = this.urls.map((sourceUrl) =>
        Policies.SourceUrlResponds.perform({ sourceUrl }).then(() => sourceUrl)
      );

      return Promise.any(options);
    } catch (error) {
      throw new Policies.SourceUrlRespondsError();
    }
  }

  private generate(url: VO.SourceUrlType): VO.SourceUrlType[] {
    const base = new URL(url);

    const withRss = `${base.origin}/rss`;
    const withRssXml = `${base.origin}/rss.xml`;
    const withFeed = `${base.origin}/feed`;
    const withFeedXml = `${base.origin}/feed.xml`;
    const withIndexXml = `${base.origin}/index.xml`;

    return [url, withRss, withRssXml, withFeed, withFeedXml, withIndexXml];
  }
}
