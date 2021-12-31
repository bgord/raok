import _ from "lodash";

import * as Events from "../events";
import * as VO from "../value-objects";
import * as Policies from "../policies";

import { EventRepository } from "../repositories/event-repository";

export class Article {
  static async add(payload: Record<"url", unknown>) {
    const articleUrl = VO.Article._def.shape().url.parse(payload.url);

    if (await Policies.ArticleUrlIsUnique.fails(articleUrl)) {
      throw new Policies.ArticleUrlIsNotUniqueError();
    }

    const event = Events.ArticleAddedEvent.parse({
      name: Events.ARTICLE_ADDED_EVENT,
      version: 1,
      payload: {
        url: articleUrl,
        source: VO.ArticleSourceEnum.web,
        status: VO.ArticleStatusEnum.ready,
      },
    });
    await EventRepository.save(event);
  }
}
