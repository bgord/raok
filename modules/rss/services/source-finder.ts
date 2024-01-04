import * as VO from "../value-objects";
import * as Policies from "../policies";

export class SourceFinder {
  private readonly urls: VO.SourceUrlType[];

  constructor(url: VO.SourceUrlType) {
    this.urls = this.generate(url);
  }

  async find(): Promise<VO.SourceUrlType> {
    const options = this.urls.map((sourceUrl) =>
      Policies.SourceUrlResponds.perform({ sourceUrl }).then(() => sourceUrl)
    );

    return Promise.any(options).catch(() => {
      throw new Policies.SourceUrlRespondsError();
    });
  }

  private generate(url: VO.SourceUrlType): VO.SourceUrlType[] {
    const base = new URL(url);

    return [
      url,
      `${base.origin}/rss`,
      `${base.origin}/rss.xml`,
      `${base.origin}/feed`,
      `${base.origin}/feed.xml`,
      `${base.origin}/index.xml`,
      `${base.origin}/atom.xml`,
      `${base.origin}/feeds.xml`,
    ];
  }
}
