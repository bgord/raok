import { Reporter } from "@bgord/node";
import { z } from "zod";
import axios from "axios";

import * as VO from "../value-objects";
import * as Services from "../services";
import { Env } from "../env";

export class Feedly {
  private static api = axios.create({
    baseURL: "https://cloud.feedly.com/v3",
    headers: { Authorization: `Bearer ${Env.FEEDLY_TOKEN}` },
  });

  static async getArticles(): Promise<NonNullable<VO.FeedlyArticleType>[]> {
    const streamId = encodeURIComponent(
      "user/d281aac1-ab35-4559-a5b6-a410fb1fa1d7/category/64b263da-85e3-4257-b13b-ee07ac1ed85c"
    );

    try {
      const response = await Feedly.api.get(
        `/streams/${streamId}/contents?unreadOnly=true`
      );

      return z
        .array(VO.FeedlyArticle)
        .parse(response.data?.items)
        .filter(Feedly.isNonTwitterUrl);
    } catch (error) {
      Reporter.raw("Feedly#getArticles", error);
      await Services.FeedlyTokenExpiredNotifier.send(error);
      return [];
    }
  }

  static async markArticlesAsRead(articleIds: VO.FeedlyArticleType["id"][]) {
    return Feedly.api.post("/markers", {
      action: "markAsRead",
      type: "entries",
      entryIds: articleIds,
    });
  }

  private static isNonTwitterUrl(
    article: VO.FeedlyArticleType
  ): article is NonNullable<VO.FeedlyArticleType> {
    return (
      article.canonicalUrl !== undefined &&
      !article.canonicalUrl.includes("twitter.com")
    );
  }
}
