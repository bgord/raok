import * as bg from "@bgord/node";

import * as Stats from "../stats";

import * as Aggregates from "./aggregates";
import * as Events from "./events";
import * as Repos from "./repositories";
import * as VO from "./value-objects";
import * as Services from "./services";

import * as infra from "../../infra";

const EventHandler = new bg.EventHandler(infra.logger);

export const onArticleAddedEventHandler =
  EventHandler.handle<Events.ArticleAddedEventType>(async (event) => {
    await Repos.ArticleRepository.create(event.payload);
    await Stats.Repos.StatsRepository.incrementCreatedArticles();

    const content = (await Services.ArticleContentDownloader.download(
      event.payload.url
    )) as VO.ArticleContentType;

    const readableArticle = Services.ReadableArticleGenerator.generate({
      content,
      url: event.payload.url,
    });

    await Repos.ArticleRepository.updateReadingTime({
      id: event.payload.id,
      estimatedReadingTimeInMinutes: readableArticle?.readingTime ?? null,
    });
  });

export const onArticleDeletedEventHandler =
  EventHandler.handle<Events.ArticleDeletedEventType>(async (event) => {
    await Repos.ArticleRepository.updateStatus(
      event.payload.articleId,
      VO.ArticleStatusEnum.deleted
    );
  });

export const onArticleUndeletedEventHandler =
  EventHandler.handle<Events.ArticleUndeleteEventType>(async (event) => {
    await Repos.ArticleRepository.updateStatus(
      event.payload.articleId,
      VO.ArticleStatusEnum.ready
    );
  });

export const onArticleLockedEventHandler =
  EventHandler.handle<Events.ArticleLockedEventType>(async (event) => {
    try {
      await Repos.ArticleRepository.updateStatus(
        event.payload.articleId,
        VO.ArticleStatusEnum.in_progress
      );

      await Repos.ArticleRepository.assignToNewspaper(
        event.payload.articleId,
        event.payload.newspaperId
      );
    } catch (error) {
      infra.logger.error({
        message: "Article locked event handler error",
        operation: "db_error",
        metadata: infra.logger.formatError(error),
      });
    }
  });

export const onArticleUnlockedEventHandler =
  EventHandler.handle<Events.ArticleUnlockedEventType>(async (event) => {
    await Repos.ArticleRepository.updateStatus(
      event.payload.articleId,
      VO.ArticleStatusEnum.ready
    );
  });

export const onArticleProcessedEventHandler =
  EventHandler.handle<Events.ArticleProcessedEventType>(async (event) => {
    await Repos.ArticleRepository.updateStatus(
      event.payload.articleId,
      VO.ArticleStatusEnum.processed
    );
  });

export const onNewspaperScheduledEventHandler =
  EventHandler.handle<Events.NewspaperScheduledEventType>(async (event) => {
    await Repos.NewspaperRepository.create({
      id: event.payload.id,
      scheduledAt: event.payload.createdAt,
      status: VO.NewspaperStatusEnum.scheduled,
    });

    for (const entity of event.payload.articles) {
      const article = await Aggregates.Article.build(entity.id);
      await article.lock(event.payload.id);
    }

    const newspaper = await new Aggregates.Newspaper(event.payload.id).build();

    await newspaper.generate();
  });

export const onNewspaperGeneratedEventHandler =
  EventHandler.handle<Events.NewspaperGenerateEventType>(async (event) => {
    await Repos.NewspaperRepository.updateStatus(
      event.payload.newspaperId,
      VO.NewspaperStatusEnum.ready_to_send
    );

    const newspaper = await new Aggregates.Newspaper(
      event.payload.newspaperId
    ).build();
    await newspaper.send();
  });

export const onNewspaperSentEventHandler =
  EventHandler.handle<Events.NewspaperSentEventType>(async (event) => {
    await Stats.Repos.StatsRepository.incrementSentNewspapers();

    await Repos.NewspaperRepository.updateStatus(
      event.payload.newspaperId,
      VO.NewspaperStatusEnum.delivered
    );

    await Repos.NewspaperRepository.updateSentAt(
      event.payload.newspaperId,
      event.payload.sentAt
    );

    for (const entity of event.payload.articles) {
      const article = await Aggregates.Article.build(entity.id);
      await article.markAsProcessed();
    }

    await Services.NewspaperFile.clear(event.payload.newspaperId);
  });

export const onNewspaperArchivedEventHandler =
  EventHandler.handle<Events.NewspaperArchivedEventType>(async (event) => {
    await Repos.NewspaperRepository.updateStatus(
      event.payload.newspaperId,
      VO.NewspaperStatusEnum.archived
    );
  });

export const onNewspaperFailedEventHandler =
  EventHandler.handle<Events.NewspaperFailedEventType>(async (event) => {
    await Repos.NewspaperRepository.updateStatus(
      event.payload.newspaperId,
      VO.NewspaperStatusEnum.error
    );

    const newspaper = await new Aggregates.Newspaper(
      event.payload.newspaperId
    ).build();

    for (const item of newspaper.articles) {
      const article = await Aggregates.Article.build(item.id);
      await article.unlock();
    }
  });

export const onDeleteOldArticlesEventHandler =
  EventHandler.handle<Events.DeleteOldArticlesEventType>(async (event) => {
    const oldArticles = await Repos.ArticleRepository.getOld(
      event.payload.marker
    );

    if (!oldArticles.length) return;

    infra.logger.info({
      message: "Deleting old articles",
      operation: "old_articles_delete",
      metadata: { count: oldArticles.length },
    });

    for (const { id } of oldArticles) {
      const article = await Aggregates.Article.build(VO.ArticleId.parse(id));
      await article.delete();
    }
  });
