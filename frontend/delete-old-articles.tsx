import { h, Fragment } from "preact";
import { useMutation, useQueryClient } from "react-query";
import * as bg from "@bgord/frontend";

import * as api from "./api";
import { ARTICLE_OLD_MARKER_IN_DAYS } from "../value-objects/article-old-marker-in-days";

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
        data-variant="secondary"
        {...props}
      >
        {deleteOldArticles.isIdle &&
          t("articles.old.delete", { value: ARTICLE_OLD_MARKER_IN_DAYS })}
        {deleteOldArticles.isLoading && t("articles.old.deleting")}
        {deleteOldArticles.isSuccess && t("articles.old.deleted")}
        {deleteOldArticles.isError && t("articles.old.could_not_delete")}
      </button>

      <bg.Dialog {...dialog} data-gap="24" data-mt="72">
        <div>
          {t("articles.old.delete.confirmation", {
            value: ARTICLE_OLD_MARKER_IN_DAYS,
          })}
        </div>

        <div data-display="flex" data-gap="48" data-mx="auto">
          <button
            type="button"
            class="c-button"
            data-variant="primary"
            onClick={() => deleteOldArticles.mutate()}
          >
            {t("app.delete")}
          </button>

          <button
            type="button"
            class="c-button"
            data-variant="bare"
            onClick={dialog.disable}
          >
            {t("app.cancel")}
          </button>
        </div>
      </bg.Dialog>
    </>
  );
}
