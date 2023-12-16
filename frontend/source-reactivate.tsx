import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";
import { h, Fragment } from "preact";
import { useQueryClient, useMutation } from "react-query";

import * as api from "./api";
import * as types from "./types";

export function SourceReactivate(
  props: types.SourceType & h.JSX.IntrinsicElements["button"]
) {
  const { id, revision, ...rest } = props;

  const t = bg.useTranslations();

  const queryClient = useQueryClient();
  const notify = bg.useToastTrigger();
  const dialog = bg.useToggle();

  const reactivateSource = useMutation(api.Source.reactivate, {
    onSuccess() {
      dialog.disable();
      notify({ message: "source.reactivate.success" });
      queryClient.invalidateQueries(api.keys.allSources);
    },
    onError() {
      setTimeout(reactivateSource.reset, 5000);
      notify({ message: "source.reactivate.error" });
    },
  });

  return (
    <>
      <button
        type="button"
        onClick={dialog.enable}
        disabled={!reactivateSource.isIdle}
        class="c-button"
        data-variant="with-icon"
        title={t("source.reactivate")}
        {...rest}
      >
        <Icons.Redo height="18" width="18" />
      </button>

      <bg.Dialog {...dialog} data-gap="24" data-mt="72">
        <div data-lh="16">{t("source.reactivate.confirmation")}</div>

        <div data-display="flex" data-gap="48" data-mx="auto">
          <button
            type="button"
            class="c-button"
            data-variant="primary"
            onClick={() => reactivateSource.mutate({ id, revision })}
          >
            {t("source.reactivate")}
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
