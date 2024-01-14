import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";
import { h, Fragment } from "preact";
import { useQueryClient, useMutation } from "react-query";

import * as api from "./api";
import * as types from "./types";

export function SourceArchive(
  props: Pick<types.SourceType, "id" | "revision"> &
    h.JSX.IntrinsicElements["button"]
) {
  const { id, revision, ...rest } = props;

  const t = bg.useTranslations();

  const queryClient = useQueryClient();
  const notify = bg.useToastTrigger();
  const dialog = bg.useToggle();

  const archiveSource = useMutation(api.Source.archive, {
    onSuccess() {
      dialog.disable();
      notify({ message: "source.archive.success" });
      queryClient.invalidateQueries(api.keys.allSources);
    },
    onError() {
      setTimeout(archiveSource.reset, 5000);
      notify({ message: "source.archive.error" });
    },
  });

  return (
    <>
      <button
        type="button"
        onClick={dialog.enable}
        disabled={!archiveSource.isIdle}
        class="c-button"
        data-variant="with-icon"
        title={t("source.archive")}
        {...rest}
      >
        <Icons.Archive height="18" width="18" />
      </button>

      <bg.Dialog {...dialog} data-gap="24" data-mt="72">
        <div data-lh="16">{t("source.archive.confirmation")}</div>

        <div data-display="flex" data-gap="48" data-mx="auto">
          <button
            type="button"
            class="c-button"
            data-variant="primary"
            onClick={() => archiveSource.mutate({ id, revision })}
          >
            {t("source.archive")}
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
