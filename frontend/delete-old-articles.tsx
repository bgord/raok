import { h, Fragment } from "preact";
import { useMutation, useQueryClient } from "react-query";
import * as bg from "@bgord/frontend";

import * as api from "./api";

export function DeleteOldArticles(props: h.JSX.IntrinsicElements["button"]) {
  const t = bg.useTranslations();

  const queryClient = useQueryClient();
  const notify = bg.useToastTrigger();
  const dialog = bg.useToggle();

  const deleteOldArticles = useMutation(api.deleteOldArticles, {
    onSuccess() {
      setTimeout(deleteOldArticles.reset, 5000);
      dialog.disable();
      notify({ message: "articles.old.deleted" });
      queryClient.invalidateQueries("articles");
    },
    onError() {
      setTimeout(deleteOldArticles.reset, 5000);
      notify({ message: "articles.old.could_not_delete" });
    },
  });

  return (
    <>
      <button
        type="button"
        onClick={dialog.enable}
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

      <bg.Dialog {...dialog} data-gap="24">
        <div>Are you sure you want to delete old articles?</div>

        <div data-display="flex" data-gap="48" data-mx="auto">
          <button
            type="button"
            class="c-button"
            data-variant="primary"
            onClick={() => deleteOldArticles.mutate()}
          >
            Delete
          </button>

          <button
            type="button"
            class="c-button"
            data-variant="bare"
            onClick={dialog.disable}
          >
            Cancel
          </button>
        </div>
      </bg.Dialog>
    </>
  );
}
