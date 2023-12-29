import { h } from "preact";
import { useMutation, useQueryClient } from "react-query";
import * as bg from "@bgord/frontend";

import * as api from "./api";
import * as types from "./types";

export function NewspaperArchive(
  props: Pick<types.NewspaperType, "id" | "revision"> &
    h.JSX.IntrinsicElements["button"]
) {
  const t = bg.useTranslations();

  const { id, ...rest } = props;

  const notify = bg.useToastTrigger();
  const queryClient = useQueryClient();

  const archiveNewspaper = useMutation(api.Newspaper.archive, {
    onSuccess: () => {
      queryClient.invalidateQueries(api.keys.newspapers);
      notify({ message: "newspaper.archived" });
    },
  });

  return (
    <button
      type="submit"
      class="c-button"
      data-variant="secondary"
      onClick={() =>
        archiveNewspaper.mutate({ id: props.id, revision: props.revision })
      }
      {...rest}
    >
      {t("newspaper.archive")}
    </button>
  );
}
