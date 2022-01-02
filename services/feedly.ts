import { z } from "zod";
import axios from "axios";

import * as VO from "../value-objects";
import { Env } from "../env";

export class Feedly {
  static async getArticles(): Promise<
    NonNullable<VO.FeedlyArticleType["canonicalUrl"]>[]
  > {
    const streamId = encodeURIComponent(
      "user/d281aac1-ab35-4559-a5b6-a410fb1fa1d7/category/64b263da-85e3-4257-b13b-ee07ac1ed85c"
    );

    try {
      const response = await axios.get(
        `https://cloud.feedly.com/v3/streams/${streamId}/contents?unreadOnly=true`,
        { headers: { Authorization: `Bearer ${Env.FEEDLY_TOKEN}` } }
      );

      return z
        .array(VO.FeedlyArticle)
        .parse(response.data?.items)
        .map((item) => item.canonicalUrl)
        .filter(Feedly.isNonTwitterUrl);
    } catch (error) {
      return [];
    }
  }

  private static isNonTwitterUrl(
    value: VO.FeedlyArticleType["canonicalUrl"]
  ): value is NonNullable<VO.FeedlyArticleType["canonicalUrl"]> {
    return value !== undefined && !value.includes("twitter.com");
  }
}
