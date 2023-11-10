import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";
import { h, Fragment } from "preact";
import { useQueryClient, useMutation } from "react-query";

import * as api from "./api";
import * as types from "./types";

export function SourceDelete(
  props: types.SourceType & h.JSX.IntrinsicElements["button"]
) {
  const { id, ...rest } = props;

  const t = bg.useTranslations();

  const queryClient = useQueryClient();
  const notify = bg.useToastTrigger();
  const dialog = bg.useToggle();

  const deleteSource = useMutation(api.Source.delete, {
    onSuccess() {
      dialog.disable();
      notify({ message: "source.delete.success" });
      queryClient.invalidateQueries("sources");
    },
    onError() {
      setTimeout(deleteSource.reset, 5000);
      notify({ message: "source.delete.error" });
    },
  });

  return (
    <>
      <button
        type="button"
        onClick={dialog.enable}
        disabled={!deleteSource.isIdle}
        class="c-button"
        data-variant="with-icon"
        title={t("source.delete")}
        {...rest}
      >
        <Icons.BinMinusIn height="18" width="18" data-color="red-500" />
      </button>

      <bg.Dialog {...dialog} data-gap="24" data-mt="72">
        <div data-lh="16">{t("source.delete.confirmation")}</div>

        <div data-display="flex" data-gap="48" data-mx="auto">
          <button
            type="button"
            class="c-button"
            data-variant="primary"
            onClick={() => deleteSource.mutate(id)}
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
