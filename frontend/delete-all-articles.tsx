import { h, Fragment } from "preact";
import { useMutation, useQueryClient } from "react-query";
import * as bg from "@bgord/frontend";
import { Dialog } from "./dialog";

import * as api from "./api";

export function DeleteAllArticles(props: h.JSX.IntrinsicElements["button"]) {
  const t = bg.useTranslations();

  const queryClient = useQueryClient();
  const notify = bg.useToastTrigger();
  const dialog = bg.useToggle();

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
    <>
      <button
        type="button"
        onClick={dialog.enable}
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

      <Dialog {...dialog}>dialog</Dialog>
    </>
  );
}
