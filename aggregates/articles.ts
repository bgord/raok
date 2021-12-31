import _ from "lodash";

import * as Events from "../events";
import * as VO from "../value-objects";
import * as Policies from "../policies";

import { EventRepository } from "../repositories/event-repository";

export class Articles {
  articles: VO.ArticleType[] = [];

  async build() {
    const events = await EventRepository.find([
      Events.ArticleAddedEvent,
      Events.ArticleDeletedEvent,
    ]);

    const articles: VO.ArticleType[] = [];

    for (const event of events) {
      if (event.name === Events.ARTICLE_ADDED_EVENT) {
        articles.push({
          id: event.payload.id,
          url: event.payload.url,
          source: event.payload.source,
          status: VO.ArticleStatusEnum.ready,
          createdAt: event.payload.createdAt,
        });
      }

      if (event.name === Events.ARTICLE_DELETED_EVENT) {
        _.remove(articles, (article) => article.id === event.payload.articleId);
      }
    }

    this.articles = articles;

    return this;
  }

  async addArticle(payload: Record<"url", unknown>) {
    const articleUrl = VO.Article._def.shape().url.parse(payload.url);

    if (await Policies.ArticleUrlIsUnique.fails(articleUrl)) {
      throw new Policies.ArticleUrlIsNotUniqueError();
    }

    const event = Events.ArticleAddedEvent.parse({
      name: Events.ARTICLE_ADDED_EVENT,
      version: 1,
      payload: { url: articleUrl, source: VO.ArticleSourceEnum.web },
    });
    await EventRepository.save(event);
  }

  async deleteArticle(payload: Record<"articleId", unknown>) {
    const articleId = VO.Article._def.shape().id.parse(payload.articleId);

    if (await Policies.ArticleShouldExist.fails(articleId)) {
      throw new Policies.ArticleDoesNotExistError();
    }
    const event = Events.ArticleDeletedEvent.parse({
      name: Events.ARTICLE_DELETED_EVENT,
      version: 1,
      payload: { articleId },
    });
    await EventRepository.save(event);
  }

  async getById(articleId: VO.ArticleType["id"]): Promise<VO.ArticleType> {
    if (await Policies.ArticleShouldExist.fails(articleId)) {
      throw new Policies.ArticleDoesNotExistError();
    }

    return this.articles.find(
      (article) => article.id === articleId
    ) as VO.ArticleType;
  }

  async toContent(articleId: VO.ArticleType["id"]) {
    const article = await this.getById(articleId);
    return _.pick(article, "id", "url");
  }
}
