import { h } from "preact";
import { useMutation, useQueryClient } from "react-query";
import { useToastTrigger, useTranslations } from "@bgord/frontend";

import * as api from "./api";

export function DeleteAllArticles(props: h.JSX.IntrinsicElements["button"]) {
  const t = useTranslations();

  const queryClient = useQueryClient();
  const notify = useToastTrigger();

  const deleteAllArticles = useMutation(api.deleteAllArticles, {
    onSuccess() {
      setTimeout(deleteAllArticles.reset, 5000);
      notify({ message: "articles.all.deleted" });
      queryClient.invalidateQueries("articles");
    },
    onError() {
      setTimeout(deleteAllArticles.reset, 5000);
      notify({ message: "articles.all.could_not_delete" });
    },
  });

  return (
    <button
      type="button"
      onClick={() => deleteAllArticles.mutate()}
      disabled={deleteAllArticles.isLoading || deleteAllArticles.isSuccess}
      class="c-button"
      data-variant="bare"
      {...props}
    >
      {deleteAllArticles.isIdle && t("articles.all.delete")}
      {deleteAllArticles.isLoading && t("articles.all.deleting")}
      {deleteAllArticles.isSuccess && t("articles.all.deleted")}
      {deleteAllArticles.isError && t("articles.all.could_not_delete")}
    </button>
  );
}
