import * as bg from "@bgord/node";
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
    const streamId = encodeURIComponent(Env.FEEDLY_STREAM_ID);

    try {
      const response = await Feedly.api.get(
        `/streams/${streamId}/contents?unreadOnly=true`
      );

      return z
        .array(VO.FeedlyArticle)
        .parse(response.data?.items)
        .filter(Feedly.isNonTwitterUrl);
    } catch (error) {
      bg.Reporter.raw("Feedly#getArticles", error);
      await Services.FeedlyTokenExpiredNotifier.handle(error);
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
