import { h } from "preact";
import { useMutation, useQueryClient } from "react-query";

import * as UI from "./ui";
import { api } from "./api";
import { ArticleType } from "./types";
import { useNotificationTrigger } from "./notifications-context";
import { UseListActionsType } from "./hooks";

export function Article(
  props: ArticleType & UseListActionsType<ArticleType["id"]>
) {
  const queryClient = useQueryClient();
  const notify = useNotificationTrigger();

  const deleteArticle = useMutation(api.deleteArticle, {
    onSuccess: () => {
      queryClient.invalidateQueries(["articles"]);
      notify({ type: "success", message: "Article deleted" });
    },
  });

  return (
    <li
      data-display="flex"
      data-cross="center"
      data-wrap="nowrap"
      data-mb="24"
      data-md-px="6"
      data-bcr="gray-100"
      data-bwr="4"
    >
      {props.status === "ready" && (
        <input
          onClick={() => props.toggle(props.id)}
          checked={props.isAdded(props.id)}
          class="c-checkbox"
          type="checkbox"
          data-mr="12"
        />
      )}

      <div
        data-display="flex"
        data-direction="column"
        data-mr="12"
        data-overflow="hidden"
      >
        <div data-mb="6" data-width="100%" data-transform="truncate">
          {props.title ?? "-"}
        </div>
        <UI.Link href={props.url} data-mr="12" data-width="100%">
          {props.url}
        </UI.Link>
      </div>

      <div
        data-display="flex"
        data-direction="column"
        data-cross="end"
        data-mr="6"
        data-ml="auto"
      >
        <UI.Badge data-mb="6">{props.status}</UI.Badge>

        <UI.Badge>{props.source}</UI.Badge>
      </div>

      {props.status === "ready" && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            deleteArticle.mutate(props.id);
          }}
        >
          <button type="submit" class="c-button" data-variant="bare">
            <img
              loading="eager"
              height="30"
              width="30"
              src="/icon-trash.svg"
              alt="delete"
            />
          </button>
        </form>
      )}
    </li>
  );
}
