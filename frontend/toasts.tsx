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
  const queryClient = useQueryClient();

  const undeleteArticle = useMutation(api.undeleteArticle, {
    onSuccess: () => {
      setTimeout(() => queryClient.invalidateQueries("articles"), 5000);
    },
  });

  return (
    <li
      aria-live="polite"
      data-display="flex"
      data-cross="center"
      data-py="6"
      data-px="12"
      data-mt="12"
      data-fs="14"
      data-color="gray-700"
      data-bg="gray-200"
      data-br="2"
      data-transform="upper-first"
    >
      {props.item.message}

      {props.item.message === "article.deleted" && (
        <button
          type="button"
          class="c-button"
          data-variant="bare"
          data-ml="auto"
          onClick={() => {
            if (!props.item.articleId) return;
            undeleteArticle.mutate(props.item.articleId);
          }}
        >
          {undeleteArticle.isIdle && "undo"}
          {undeleteArticle.isLoading && "..."}
          {undeleteArticle.isSuccess && "✓"}
        </button>
      )}
    </li>
  );
}
