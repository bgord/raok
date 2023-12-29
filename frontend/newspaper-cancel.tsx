import { h } from "preact";
import { useMutation, useQueryClient } from "react-query";
import * as bg from "@bgord/frontend";

import * as api from "./api";
import * as types from "./types";

export function NewspaperCancel(
  props: Pick<types.NewspaperType, "id" | "revision"> &
    h.JSX.IntrinsicElements["button"]
) {
  const { id, ...rest } = props;

  const t = bg.useTranslations();
  const notify = bg.useToastTrigger();
  const queryClient = useQueryClient();

  const cancelNewspaper = useMutation(api.Newspaper.cancel, {
    onSuccess: () => {
      queryClient.invalidateQueries(api.keys.newspapers);
      queryClient.invalidateQueries(api.keys.articles);
      queryClient.invalidateQueries("archive-newspapers");
      notify({ message: "newspaper.cancelled" });
    },
  });

  return (
    <button
      type="submit"
      class="c-button"
      data-variant="secondary"
      onClick={() => cancelNewspaper.mutate({ id, revision: props.revision })}
      {...rest}
    >
      {t("app.cancel")}
    </button>
  );
}
