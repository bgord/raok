import { h } from "preact";
import { useQueryClient, useMutation } from "react-query";
import * as bg from "@bgord/frontend";

import * as api from "./api";
import * as types from "./types";

export function Toasts() {
  const [_toasts] = bg.useToastsContext<types.ToastType>();
  const toasts = bg.useAnimaList(_toasts, { direction: "tail" });

  return (
    <bg.AnimaList
      data-display="flex"
      data-direction="column"
      data-main="end"
      data-position="fixed"
      data-bottom="0"
      data-right="0"
      data-mb="12"
      data-pt="12"
      data-width="100%"
      {...bg.Rhythm().times(24).style.square}
    >
      {toasts.items.map((toast) => (
        <bg.Anima key={toast.item.id} effect="opacity" {...toast.props}>
          <Toast {...toast} />
        </bg.Anima>
      ))}
    </bg.AnimaList>
  );
}

function Toast(props: bg.UseAnimaListItemType<types.ToastType>) {
  const t = bg.useTranslations();
  const queryClient = useQueryClient();

  const undeleteArticle = useMutation(api.undeleteArticle, {
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
      box-shadow
    >
      <div
        data-display="flex"
        data-main="between"
        data-cross="center"
        data-width="100%"
      >
        <span data-transform="upper-first">{t(props.item.message)}</span>

        {props.item.message === "article.deleted" && (
          <button
            type="button"
            class="c-button"
            data-variant="bare"
            data-fs="16"
            disabled={undeleteArticle.isSuccess}
            onClick={() => {
              if (!props.item.articleId) return;
              undeleteArticle.mutate({
                id: props.item.articleId,
                revision: ((props.item.revision ?? 0) +
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
        title={props.item.articleTitle ?? ""}
        data-transform="truncate"
        data-max-width="100%"
      >
        {props.item.articleTitle}
      </div>
    </li>
  );
}
