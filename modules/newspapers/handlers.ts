import * as bg from "@bgord/node";

import * as Stats from "../stats";
import * as Recommendations from "../recommendations";

import { Article, Newspaper } from "./aggregates";
import { DeviceManager } from "./services/device-manager";
import * as Events from "./events";
import * as VO from "./value-objects";
import {
  NewspaperFile,
  ReadableArticleGenerator,
  ArticleContentDownloader,
} from "./services";

import { ArticleRepository } from "./repositories/article-repository";
import { NewspaperRepository } from "./repositories/newspaper-repository";

import * as infra from "../../infra";

const EventHandler = new bg.EventHandler(infra.logger);

export const onArticleAddedEventHandler =
  EventHandler.handle<Events.ArticleAddedEventType>(async (event) => {
    await ArticleRepository.create(event.payload);
    await Stats.Repos.StatsRepository.incrementCreatedArticles();

    const content = (await ArticleContentDownloader.download(
      event.payload.url
    )) as VO.ArticleContentType;

    const readableArticle = ReadableArticleGenerator.generate({
      content,
      url: event.payload.url,
    });

    await ArticleRepository.updateReadingTime({
      id: event.payload.id,
      estimatedReadingTimeInMinutes: readableArticle?.readingTime ?? null,
    });

    await ArticleRepository.updateRating({
      id: event.payload.id,
      rating: await Recommendations.Services.TextRatingCalculator.calculate(
        readableArticle?.title
      ),
    });
  });

export const onArticleDeletedEventHandler =
  EventHandler.handle<Events.ArticleDeletedEventType>(async (event) => {
    await ArticleRepository.updateStatus({
      id: event.payload.articleId,
      status: VO.ArticleStatusEnum.deleted,
      revision: event.payload.revision,
    });
  });

export const onArticleReadEventHandler =
  EventHandler.handle<Events.ArticleReadEventType>(async (event) => {
    await ArticleRepository.updateStatus({
      id: event.payload.articleId,
      status: VO.ArticleStatusEnum.read,
      revision: event.payload.revision,
    });
    await Stats.Repos.StatsRepository.incrementReadArticles();
  });

export const onArticleUndeletedEventHandler =
  EventHandler.handle<Events.ArticleUndeleteEventType>(async (event) => {
    await ArticleRepository.updateStatus({
      id: event.payload.articleId,
      status: VO.ArticleStatusEnum.ready,
      revision: event.payload.revision,
    });
  });

export const onArticleLockedEventHandler =
  EventHandler.handle<Events.ArticleLockedEventType>(async (event) => {
    try {
      await ArticleRepository.updateStatus({
        id: event.payload.articleId,
        status: VO.ArticleStatusEnum.in_progress,
        revision: event.payload.revision,
      });

      await ArticleRepository.assignToNewspaper(
        event.payload.articleId,
        event.payload.newspaperId,
        event.payload.revision
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
    await ArticleRepository.updateStatus({
      id: event.payload.articleId,
      status: VO.ArticleStatusEnum.ready,
      revision: event.payload.revision,
    });
  });

export const onArticleProcessedEventHandler =
  EventHandler.handle<Events.ArticleProcessedEventType>(async (event) => {
    await ArticleRepository.updateStatus({
      id: event.payload.articleId,
      status: VO.ArticleStatusEnum.processed,
      revision: event.payload.revision,
    });
    await Stats.Repos.StatsRepository.incrementSentArticles();
  });

export const onArticleOpenedEventHandler =
  EventHandler.handle<Events.ArticleOpenedEventType>(async () => {
    await Stats.Repos.StatsRepository.incrementOpenedArticles();
  });

export const onNewspaperScheduledEventHandler =
  EventHandler.handle<Events.NewspaperScheduledEventType>(async (event) => {
    await NewspaperRepository.create({
      id: event.payload.id,
      scheduledAt: event.payload.createdAt,
      status: VO.NewspaperStatusEnum.scheduled,
    });

    for (const entity of event.payload.articles) {
      const article = await Article.build(entity.id);
      const revision = new bg.Revision(article.revision);

      await article.lock(event.payload.id, revision);
    }

    const newspaper = await new Newspaper(event.payload.id).build();
    const revision = new bg.Revision(newspaper.revision);

    await newspaper.generate(revision);
  });

export const onNewspaperGeneratedEventHandler =
  EventHandler.handle<Events.NewspaperGenerateEventType>(async (event) => {
    await NewspaperRepository.updateStatus({
      id: event.payload.newspaperId,
      status: VO.NewspaperStatusEnum.ready_to_send,
      revision: event.payload.revision,
    });

    const newspaper = await new Newspaper(event.payload.newspaperId).build();
    const revision = new bg.Revision(newspaper.revision);

    const deviceManager = await DeviceManager.build();
    const primaryDevice = deviceManager.getPrimaryDevice();

    await newspaper.send(revision, primaryDevice.specification.email);
  });

export const onNewspaperSentEventHandler =
  EventHandler.handle<Events.NewspaperSentEventType>(async (event) => {
    await Stats.Repos.StatsRepository.incrementSentNewspapers();

    await NewspaperRepository.updateStatus({
      id: event.payload.newspaperId,
      status: VO.NewspaperStatusEnum.delivered,
      revision: event.payload.revision,
    });

    await NewspaperRepository.updateSentAt({
      id: event.payload.newspaperId,
      sentAt: event.payload.sentAt,
      revision: event.payload.revision,
    });

    for (const entity of event.payload.articles) {
      const article = await Article.build(entity.id);
      const revision = new bg.Revision(article.revision);

      await article.markAsProcessed(revision);
    }

    await NewspaperFile.clear(event.payload.newspaperId);
  });

export const onNewspaperArchivedEventHandler =
  EventHandler.handle<Events.NewspaperArchivedEventType>(async (event) => {
    await NewspaperRepository.updateStatus({
      id: event.payload.newspaperId,
      status: VO.NewspaperStatusEnum.archived,
      revision: event.payload.revision,
    });
  });

export const onNewspaperFailedEventHandler =
  EventHandler.handle<Events.NewspaperFailedEventType>(async (event) => {
    await NewspaperRepository.updateStatus({
      id: event.payload.newspaperId,
      status: VO.NewspaperStatusEnum.error,
      revision: event.payload.revision,
    });

    const newspaper = await new Newspaper(event.payload.newspaperId).build();

    for (const item of newspaper.articles) {
      const article = await Article.build(item.id);
      const revision = new bg.Revision(article.revision);
      await article.unlock(revision);
    }
  });
