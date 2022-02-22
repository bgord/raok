import { h } from "preact";
import { useMutation, useQueryClient } from "react-query";
import * as bg from "@bgord/frontend";

import * as UI from "./ui";
import * as Icons from "./icons";
import * as api from "./api";
import { ArticleType } from "./types";

type ArticlePropsType = ArticleType &
  bg.UseListActionsType<ArticleType["id"]> &
  h.JSX.IntrinsicElements["li"];

export function Article(props: ArticlePropsType) {
  const queryClient = useQueryClient();
  const notify = bg.useToastTrigger();

  const deleteArticle = useMutation(api.deleteArticle, {
    onSuccess: () => {
      queryClient.invalidateQueries(["articles"]);
      notify({ message: "Article deleted" });
    },
  });

  return (
    // TODO: Decrease spacing on mobile
    <li
      data-display="flex"
      data-md-direction="column"
      data-wrap="nowrap"
      data-mb="24"
      data-md-mx="6"
      {...bg.getAnimaProps(props)}
    >
      <div data-display="flex" data-wrap="nowrap" data-overflow="hidden">
        <input
          onClick={() => props.toggle(props.id)}
          checked={props.isAdded(props.id)}
          class="c-checkbox"
          type="checkbox"
          data-my="auto"
          data-mr="12"
        />
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
            data-md-fs="14"
            data-transform="truncate"
            title={props.title}
          >
            {props.title}
          </div>
          <UI.OutboundLink
            href={props.url}
            data-width="100%"
            data-fs="14"
            data-md-fs="12"
          >
            {props.url}
          </UI.OutboundLink>
        </div>
      </div>

      <div
        data-display="flex"
        data-direction="column"
        data-md-direction="row"
        data-cross="center"
        data-ml="auto"
        data-md-mt="6"
      >
        <UI.Badge>{props.source}</UI.Badge>

        <form
          data-md-ml="6"
          onSubmit={(event) => {
            event.preventDefault();
            deleteArticle.mutate(props.id);
          }}
        >
          <button type="submit" class="c-button" data-variant="bare">
            <Icons.Trash />
          </button>
        </form>
      </div>
    </li>
  );
}
