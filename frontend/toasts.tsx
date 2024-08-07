import { h } from "preact";
import { useQueryClient, useMutation } from "react-query";
import * as bg from "@bgord/frontend";

import * as api from "./api";
import * as types from "./types";

export function Toasts() {
  const [toasts] = bg.useToastsContext<types.ToastType>();

  return (
    <ul
      data-display="flex"
      data-direction="column"
      data-main="end"
      data-z="2"
      data-position="fixed"
      data-bottom="0"
      data-right="0"
      data-mb="12"
      data-pt="12"
      data-width="100%"
      style={{
        ...bg.Rhythm().times(24).maxHeight,
        ...bg.Rhythm().times(24).maxWidth,
      }}
    >
      {toasts.map((toast) => (
        <Toast {...toast} key={toast.id} />
      ))}
    </ul>
  );
}

function Toast(props: types.ToastType) {
  const t = bg.useTranslations();
  const queryClient = useQueryClient();

  const undeleteArticle = useMutation(api.Article.undelete, {
    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries(api.keys.articles);
        queryClient.invalidateQueries(api.keys.stats);
      }, 2000);
    },
  });

  return (
    <li
      aria-live="polite"
      data-py="6"
      data-px="12"
      data-mt="12"
      data-fs="14"
      data-color="gray-700"
      data-bg="gray-200"
      data-br="2"
      data-max-width="100%"
      data-width="100%"
      box-shadow
    >
      <div
        data-display="flex"
        data-main="between"
        data-cross="center"
        data-width="100%"
      >
        <span data-transform="upper-first">{t(props.message)}</span>

        {["article.deleted", "article.marked-as-read"].includes(
          props.message,
        ) && (
          <button
            type="button"
            class="c-button"
            data-variant="bare"
            data-fs="16"
            disabled={undeleteArticle.isSuccess}
            onClick={() => {
              if (!props.articleId) return;
              undeleteArticle.mutate({
                id: props.articleId,
                revision: ((props.revision ?? 0) +
                  1) as types.ArticleType["revision"],
              });
            }}
          >
            {undeleteArticle.isIdle && t("app.undo")}
            {undeleteArticle.isLoading && t("app.three_dots")}
            {undeleteArticle.isSuccess && t("app.done")}
          </button>
        )}
      </div>

      <div
        title={props.articleTitle ?? ""}
        data-transform="truncate"
        data-max-width="100%"
      >
        {props.articleTitle}
      </div>
    </li>
  );
}
