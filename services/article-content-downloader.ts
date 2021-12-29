import axios from "axios";

import * as VO from "../value-objects";

export class ArticleContentDownloader {
  static async download(
    url: VO.NewspaperType["articles"][0]["url"]
  ): Promise<VO.ArticleContentType | null> {
    try {
      const result = await axios.get(url);

      return result.data;
    } catch (error) {
      return null;
    }
  }
}
