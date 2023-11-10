import * as VO from "../value-objects";

export class ArticleContentDownloader {
  static async download(
    url: VO.NewspaperType["articles"][0]["url"]
  ): Promise<VO.ArticleContentType | null> {
    try {
      const result = await fetch(url, { method: "GET" });
      const text = await result.text();

      return VO.ArticleContent.parse(text);
    } catch (error) {
      return null;
    }
  }
}
