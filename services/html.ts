import serialize from "serialize-javascript";

type HtmlConfigType = {
  frontend: string;
  state: Record<string, any>;
};

export class Html {
  static process(config: HtmlConfigType): string {
    const serializedState = Html.serializeState(config.state);

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
          <div id="root">${config.frontend}</div>

          <script>
            window.__STATE__ = ${serializedState};
          </script>

          <script async src="/index.js"></script>
        </body>
      </html>
    `;
  }

  private static serializeState(state: HtmlConfigType["state"]): string {
    return serialize(state, { isJSON: true });
  }
}
