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
      data-position="fixed"
      data-bottom="0"
      data-right="0"
      data-mb="12"
      data-pt="12"
      data-width="100%"
      style={{ maxWidth: "290px" }}
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
        queryClient.invalidateQueries("articles");
        queryClient.invalidateQueries("stats");
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
    >
      <div
        data-display="flex"
        data-main="between"
        data-cross="center"
        data-width="100%"
      >
        {t(props.item.message)}

        {props.item.message === "article.deleted" && (
          <button
            type="button"
            class="c-button"
            data-variant="bare"
            data-fs="16"
            disabled={undeleteArticle.isSuccess}
            onClick={() => {
              if (!props.item.articleId) return;
              undeleteArticle.mutate(props.item.articleId);
            }}
          >
            {undeleteArticle.isIdle && "undo"}
            {undeleteArticle.isLoading && "..."}
            {undeleteArticle.isSuccess && "done"}
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
