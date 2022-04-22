import { h } from "preact";
import { useMutation, useQueryClient } from "react-query";
import { useToastTrigger, useTranslations } from "@bgord/frontend";

import * as api from "./api";

export function DeleteOldArticles(props: h.JSX.IntrinsicElements["button"]) {
  const t = useTranslations();

  const queryClient = useQueryClient();
  const notify = useToastTrigger();

  const deleteOldArticles = useMutation(api.deleteOldArticles, {
    onSuccess() {
      setTimeout(deleteOldArticles.reset, 5000);
      notify({ message: "articles.old.deleted" });
      queryClient.invalidateQueries("articles");
    },
    onError() {
      setTimeout(deleteOldArticles.reset, 5000);
      notify({ message: "articles.old.could_not_delete" });
    },
  });

  return (
    <button
      type="button"
      onClick={() => deleteOldArticles.mutate()}
      disabled={deleteOldArticles.isLoading || deleteOldArticles.isSuccess}
      class="c-button"
      data-variant="bare"
      {...props}
    >
      {deleteOldArticles.isIdle && t("articles.old.delete")}
      {deleteOldArticles.isLoading && t("articles.old.deleting")}
      {deleteOldArticles.isSuccess && t("articles.old.deleted")}
      {deleteOldArticles.isError && t("articles.old.could_not_delete")}
    </button>
  );
}
