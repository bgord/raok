import { z } from "zod";
import { ARTICLE_URL_MAX_CHARS } from "./article-url-max-chars";

export const ArticleUrl = z
  .string()
  .trim()
  .url()
  .min(1)
  .max(ARTICLE_URL_MAX_CHARS)
  .transform((value) => {
    const MARKETING_PARAMS = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "ck_subscriber_id",
    ];

    const url = new URL(value);
    const params = url.searchParams;

    MARKETING_PARAMS.forEach((param) => params.delete(param));

    url.search = params.toString();

    return url.toString();
  });

export type ArticleUrlType = z.infer<typeof ArticleUrl>;
