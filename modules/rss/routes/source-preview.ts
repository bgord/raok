import * as bg from "@bgord/node";
import express from "express";

import * as VO from "../value-objects";
import * as Service from "../services";

import * as infra from "../../../infra";

export async function SourcePreview(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const sourceId = VO.SourceId.parse(request.params.sourceId);

  const source = await Service.Source.build(sourceId);

  const rss = await Service.RSSDownloader.downlaod(source.data.url);

  const items = rss.map((item) => ({
    url: item.link,
    createdAt: bg.RelativeDate.falsy(
      item.isoDate ? new Date(item.isoDate).getTime() : null
    ),
  }));

  infra.ResponseCache.set(request.url, items, bg.Time.Minutes(5).minutes);
  return response.status(200).send(items);
}
