import { h, Fragment } from "preact";
import { useRef } from "preact/hooks";
import { RoutableProps } from "preact-router";
import { useQuery, useMutation, useQueryClient } from "react-query";
import useStateMachine, { t as typed } from "@cassiozen/usestatemachine";
import * as bg from "@bgord/frontend";

import * as api from "./api";
import * as ui from "./ui";
import * as types from "./types";

export type InitialReviewDataType = {
  articles: types.ArticleType[];
};

export function Review(props: RoutableProps & InitialReviewDataType) {
  const articles = useQuery("articles", api.getArticles, {
    initialData: props.articles,
  });

  const numberOfArticles = articles.data?.length ?? 0;
  const areThereArticles = numberOfArticles > 0;

  return (
    <main
      data-display="flex"
      data-direction="column"
      data-mx="auto"
      data-mt="48"
      data-md-px="6"
      data-max-width="768"
    >
      {!areThereArticles && <div>No articles to review</div>}
      {areThereArticles && <Reviewer articles={articles.data ?? []} />}
    </main>
  );
}

function Reviewer(props: { articles: types.ArticleType[] }) {
  const notify = bg.useToastTrigger();
  const queryClient = useQueryClient();

  const articles = useRef<types.ArticleType[]>(props.articles);

  const deleteArticle = useMutation(api.deleteArticle, {
    onSuccess: () => {
      queryClient.invalidateQueries("articles");
      notify({ message: "article.deleted" });
    },
  });

  const [state, send] = useStateMachine({
    initial: "idle",

    context: { numberOfArticles: articles.current.length, currentIndex: 0 },

    schema: {
      events: { DECLINED: typed<{ id: types.ArticleType["id"] }>() },
    },

    states: {
      idle: {
        on: { START: "reviewing" },
        effect({ setContext }) {
          setContext((context) => ({ ...context, currentIndex: 0 }));
        },
      },

      reviewing: {
        on: {
          CANCEL: "idle",
          ACCEPTED: "reviewing",
          DECLINED: "reviewing",
          FINISH: "done",
        },
        effect({ event, send, setContext, context }) {
          if (context.currentIndex + 1 === context.numberOfArticles) {
            return send("FINISH");
          }

          if (["ACCEPTED", "DECLINED"].includes(event.type)) {
            setContext((context) => ({
              ...context,
              currentIndex: context.currentIndex + 1,
            }));
          }

          if (event.type === "DECLINED") {
            deleteArticle.mutate(event.id);
          }
        },
      },

      done: {},
    },
  });

  if (state.value === "idle") {
    return (
      <div>
        <div data-display="flex" data-mb="12">
          You have {props.articles.length} articles to review
        </div>
        <button
          type="button"
          class="c-button"
          data-variant="bare"
          onClick={() => send("START")}
        >
          Start reviewing
        </button>
      </div>
    );
  }

  if (state.value === "reviewing") {
    const { currentIndex, numberOfArticles } = state.context;

    const id = articles.current[currentIndex]?.id as types.ArticleType["id"];
    const url = articles.current[currentIndex]?.url;
    const title = articles.current[currentIndex]?.title;

    return (
      <Fragment>
        <div
          data-display="flex"
          data-cross="center"
          data-width="100%"
          data-max-width="768"
          data-md-max-width="100%"
        >
          <div>
            Reviewing articles {currentIndex + 1}/{numberOfArticles}
          </div>

          <button
            type="button"
            class="c-button"
            data-variant="bare"
            data-ml="auto"
            onClick={() => send("CANCEL")}
          >
            Cancel
          </button>
        </div>

        <div
          data-display="flex"
          data-direction="column"
          data-mt="36"
          data-max-width="100%"
        >
          <div data-mb="6">{title}</div>

          <ui.Link data-max-width="100%" href={url} title={title ?? undefined}>
            {url}
          </ui.Link>

          <div data-bg="gray-200" data-mt="24">
            <button
              type="button"
              class="c-button"
              data-variant="bare"
              data-bg="gray-200"
              data-mr="24"
              onClick={() => send("ACCEPTED")}
              style={{ width: "calc(50% - 12px)" }}
            >
              Accept
            </button>

            <button
              type="button"
              class="c-button"
              data-variant="bare"
              onClick={() => send({ type: "DECLINED", id })}
              style={{ width: "calc(50% - 12px)" }}
            >
              Decline
            </button>
          </div>
        </div>
      </Fragment>
    );
  }

  if (state.value === "done") {
    return <div>Done!</div>;
  }

  return null;
}
