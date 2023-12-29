import * as bg from "@bgord/frontend";
import { h } from "preact";
import { useMutation, useQueryClient } from "react-query";

import * as api from "./api";
import * as types from "./types";

export function NewspaperResend(
  props: types.NewspaperType & bg.UseToggleReturnType
) {
  const t = bg.useTranslations();
  const queryClient = useQueryClient();
  const notify = bg.useToastTrigger();
  const { toggle, rest } = bg.extractUseToggle(props);

  const resendNewspaper = useMutation(api.Newspaper.resend, {
    onSuccess: () => {
      queryClient.invalidateQueries(api.keys.newspapers);
      queryClient.invalidateQueries(api.keys.articles);
      queryClient.invalidateQueries(api.keys.stats);

      notify({ message: "newspaper.resent" });
    },
  });

  return (
    <button
      type="submit"
      class="c-button"
      data-variant="secondary"
      data-mr="12"
      onClick={() => {
        resendNewspaper.mutate({ id: rest.id, revision: rest.revision });
        toggle.disable();
      }}
    >
      {t("newspaper.resend")}
    </button>
  );
}
