import express from "express";
import render from "preact-render-to-string";
import serialize from "serialize-javascript";
import packageJson from "../package.json";

import * as VO from "../value-objects";
import { ArticleRepository } from "../repositories/article-repository";
import { NewspaperRepository } from "../repositories/newspaper-repository";
import { StatsRepository } from "../repositories/stats-repository";
import { Settings } from "../aggregates/settings";

import { App } from "../frontend/app";

function Html(content: string, state: string) {
  return /* HTML */ `
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link as="style" rel="stylesheet preload" href="/normalize.min.css" />
        <link as="style" rel="stylesheet preload" href="/main.min.css" />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />

        <style>
          *[data-anima="appeared"] {
            transition: all var(--duration, 300ms);
          }
          *[data-anima="hidding"] {
            transition: all var(--duration, 300ms);
          }

          *[data-anima-style="opacity"][data-anima="appearing"] {
            opacity: 0;
          }
          *[data-anima-style="opacity"][data-anima="appeared"] {
            opacity: 1;
          }
          *[data-anima-style="opacity"][data-anima="hidding"] {
            opacity: 0;
          }

          @keyframes rotate {
            from {
              transform: rotate(0);
            }
            to {
              transform: rotate(360deg);
            }
          }

          *[data-anima-effect="rotate"] {
            animation: rotate 330ms linear infinite;
          }

          .c-link--active {
            text-decoration: underline !important;
          }
        </style>

        <title>RAOK - read articles on Kindle</title>
      </head>

      <body data-mx="auto">
        <div id="root">${content}</div>

        <script>
          window.__STATE__ = ${state};
        </script>

        <script async src="/index.js"></script>
      </body>
    </html>
  `;
}

export async function Dashboard(
  request: express.Request,
  response: express.Response,
  _next: express.NextFunction
) {
  const articles = await ArticleRepository.getAllNonProcessed();
  const archiveArticles = await ArticleRepository.getAll();
  const favouriteArticles = await ArticleRepository.getFavourite();
  const newspapers = await NewspaperRepository.getAllNonArchived();
  const stats = await StatsRepository.getAll();
  const archiveNewspapers = await NewspaperRepository.getAll();
  const settings = await new Settings().build();

  const initialData = {
    stats,
    articles,
    newspapers,
    favouriteArticles,
    archiveArticles,
    archiveNewspapers,
    settings: {
      hours: VO.Hour.listFormatted(),
      articlesToReviewNotificationHour: VO.Hour.format(
        settings.articlesToReviewNotificationHour
      ),
      isArticlesToReviewNotificationEnabled:
        settings.isArticlesToReviewNotificationEnabled,
    },
    BUILD_DATE: Date.now(),
    BUILD_VERSION: `v${packageJson.version}`,
  };

  const app = render(App({ ...initialData, url: request.url }));

  return response.send(Html(app, serialize(initialData, { isJSON: true })));
}
