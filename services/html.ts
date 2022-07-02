import * as bg from "@bgord/node";
import serialize from "serialize-javascript";

type HtmlConfigType = {
  frontend: string;
  state: Record<string, unknown>;
  language: bg.Schema.LanguageType;
};

export class Html {
  static process(config: HtmlConfigType): string {
    const serializedState = Html.serializeState(config.state);

    return /* HTML */ `
      <!DOCTYPE html>
      <html lang="${config.language}">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />

          <link as="style" rel="stylesheet preload" href="/normalize.min.css" />
          <link as="style" rel="stylesheet preload" href="/main.min.css" />

          <link
            as="image"
            rel="preload"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <link rel="manifest" href="/site.webmanifest" />

          <style>
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
