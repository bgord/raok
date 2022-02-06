import { h } from "preact";
import { useMutation, useQueryClient } from "react-query";
import omit from "lodash/omit";

import * as UI from "./ui";
import * as Icons from "./icons";
import { api } from "./api";
import { ArticleType } from "./types";
import { useNotificationTrigger } from "./notifications-context";
import { UseListActionsType } from "./hooks";

export function Article(
  props: ArticleType &
    UseListActionsType<ArticleType["id"]> &
    h.JSX.IntrinsicElements["li"]
) {
  const rest = omit(props, [
    "id",
    "url",
    "title",
    "description",
    "status",
    "source",
    "createdAt",
    "favouritedAt",
  ]);

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
      data-md-direction="column"
      data-wrap="nowrap"
      data-mb="24"
      {...rest}
    >
      <div data-display="flex" data-wrap="nowrap" data-overflow="hidden">
        {props.status === "ready" && (
          <input
            onClick={() => props.toggle(props.id)}
            checked={props.isAdded(props.id)}
            class="c-checkbox"
            type="checkbox"
            data-my="auto"
            data-mr="12"
          />
        )}
        <div
          data-display="flex"
          data-direction="column"
          data-max-width="100%"
          data-overflow="hidden"
          data-mr="12"
          data-md-mr="3"
        >
          <div
            data-width="100%"
            data-mb="3"
            data-md-mb="0"
            data-transform="truncate"
            data-md-fs="14"
          >
            {props.title ?? "-"}
          </div>
          <UI.Link
            href={props.url}
            data-width="100%"
            data-fs="14"
            data-md-fs="12"
          >
            {props.url}
          </UI.Link>
        </div>
      </div>

      <div
        data-display="flex"
        data-wrap="nowrap"
        data-cross="center"
        data-ml="auto"
        data-md-mt="6"
      >
        <div
          data-display="flex"
          data-direction="column"
          data-md-direction="row"
          data-md-mt="3"
        >
          <UI.Badge
            data-mb="6"
            data-md-mb="0"
            data-md-mr="6"
            style="text-align: center"
          >
            {props.status}
          </UI.Badge>

          <UI.Badge style="text-align: center">{props.source}</UI.Badge>
        </div>

        {props.status === "ready" && (
          <form
            data-ml="6"
            onSubmit={(event) => {
              event.preventDefault();
              deleteArticle.mutate(props.id);
            }}
          >
            <button type="submit" class="c-button" data-variant="bare">
              <Icons.Trash />
            </button>
          </form>
        )}
      </div>
    </li>
  );
}
