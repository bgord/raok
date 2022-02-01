import express from "express";
import render from "preact-render-to-string";
import serialize from "serialize-javascript";

import { ArticleRepository } from "../repositories/article-repository";
import { NewspaperRepository } from "../repositories/newspaper-repository";
import { StatsRepository } from "../repositories/stats-repository";

import { App } from "../frontend/app";

function Html(content: string, username: string, state: string) {
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

          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-30px);
            }
            to {
              opacity: 1;
              transform: translateX(0px);
            }
          }

          @keyframes slideOut {
            from {
              opacity: 1;
              transform: translateX(0px);
            }
            to {
              opacity: 0;
              transform: translateX(-30px);
            }
          }

          *[data-notification="appearing"] {
            animation: slideIn 0.3s ease-out;
          }

          *[data-notification="visible"] {
            opacity: 1;
            transform: translateX(0);
          }

          *[data-notification="hidding"] {
            animation: slideOut 0.3s ease-out;
          }
        </style>

        <title>RAOK - read articles on Kindle</title>
      </head>

      <body data-mx="auto">
        <header
          data-display="flex"
          data-p="12"
          data-md-px="12"
          data-bg="gray-800"
        >
          <a href="/dashboard">
            <h1 data-fs="20" data-ls="2" data-color="gray-100" data-fw="500">
              raok
            </h1>
          </a>

          <a
            class="c-link"
            data-color="white"
            href="/archive/articles"
            data-ml="auto"
            data-mr="24"
          >
            Articles
          </a>

          <a
            class="c-link"
            data-color="white"
            href="/archive/newspapers"
            data-mr="24"
          >
            Newspapers
          </a>

          <a class="c-link" data-color="white" href="/settings"> Settings </a>

          <strong data-mx="36" data-color="white">${username}</strong>

          <a
            class="c-link"
            data-color="white"
            data-mr="12"
            data-md-mr="0"
            href="/logout"
          >
            Logout
          </a>
        </header>

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

  const initialData = {
    stats,
    articles,
    newspapers,
    favouriteArticles,
    archiveArticles,
    archiveNewspapers,
  };
  const app = render(App({ ...initialData, url: request.url }));

  return response.send(
    Html(app, request.user as string, serialize(initialData, { isJSON: true }))
  );
}
