import { h } from "preact";

import { ArticleType } from "./types";

export function ArchiveArticle(props: ArticleType) {
  return (
    <li
      data-display="flex"
      data-cross="center"
      data-wrap="nowrap"
      data-mb="24"
      data-md-px="6"
      data-max-width="768"
      data-width="100%"
    >
      <div
        data-display="flex"
        data-direction="column"
        data-mr="12"
        data-overflow="hidden"
      >
        <div data-display="flex" data-wrap="nowrap" data-max-width="100%">
          {props.favourite && (
            <img
              loading="eager"
              height="20"
              width="20"
              src="/icon-star-filled.svg"
              alt=""
              data-mr="6"
            />
          )}
          <div data-mb="3" data-width="100%" data-transform="truncate">
            {props.title}
          </div>
        </div>
        <a
          target="_blank"
          class="c-link"
          data-color="gray-700"
          data-transform="truncate"
          href="{{ this.url }}"
          data-mr="12"
          data-width="100%"
          data-fs="14"
        >
          {props.url}
        </a>
      </div>

      <div
        data-display="flex"
        data-direction="column"
        data-cross="center"
        data-ml="auto"
      >
        <strong
          data-transform="uppercase"
          data-color="gray-600"
          data-bg="gray-200"
          data-px="6"
          data-br="4"
          data-ls="1"
          data-fs="12"
          data-mb="6"
          data-width="100%"
          style="text-align: center"
        >
          {props.status}
        </strong>

        <strong
          data-transform="uppercase"
          data-color="gray-600"
          data-bg="gray-200"
          data-px="6"
          data-br="4"
          data-ls="1"
          data-fs="12"
          data-width="100%"
          style="text-align: center"
        >
          {props.source}
        </strong>
      </div>
    </li>
  );
}
