import * as bg from "@bgord/node";
import express from "express";

import * as infra from "../../../infra";
import * as VO from "../value-objects";
import * as Aggregates from "../aggregates";
import * as Services from "../services";

export async function ArticleDeliverByEmail(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const revision = bg.Revision.fromWeakETag(request.WeakETag);
  const id = VO.ArticleId.parse(request.params.articleId);

  const article = await Aggregates.Article.build(id);

  const message = await Services.ArticleEmailMessageComposer.compose(
    article.entity.url
  );

  await article.markAsProcessed(revision);
  await infra.Mailer.send({
    to: infra.Env.EMAIL_FOR_NOTIFICATIONS,
    from: infra.Env.EMAIL_FROM,
    ...message,
  });

  return response.send();
}
