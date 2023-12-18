import * as bg from "@bgord/frontend";
import { h } from "preact";
import { useMutation, useQueryClient } from "react-query";

import * as api from "./api";
import * as types from "./types";
import * as UI from "./ui";

export function SourceCreate() {
  const t = bg.useTranslations();
  const notify = bg.useToastTrigger();
  const queryClient = useQueryClient();

  const sourceUrl = bg.useField<types.SourceType["url"]>("source-url", "");

  const createSource = useMutation(api.Source.create, {
    onSuccess: () => {
      sourceUrl.clear();
      queryClient.invalidateQueries(api.keys.allSources);
      notify({ message: "source.create.success" });
    },
    onError: (error: bg.ServerError) => notify({ message: error.message }),
  });

  return (
    <form
      data-display="flex"
      data-cross="end"
      data-gap="12"
      data-md-gap="12"
      data-mt="24"
      data-mb="12"
      onSubmit={(event) => {
        event.preventDefault();
        createSource.mutate(sourceUrl.value);
      }}
    >
      <div
        data-display="flex"
        data-cross="center"
        data-wrap="nowrap"
        data-grow="1"
        data-gap="6"
        {...bg.Rhythm().times(30).style.maxWidth}
      >
        <label class="c-label" {...sourceUrl.label.props}>
          {t("source.url.label")}
        </label>
        <input
          class="c-input"
          type="url"
          data-grow="1"
          placeholder={t("source.url.placeholder")}
          onChange={sourceUrl.handleChange}
          value={sourceUrl.value}
          {...bg.Form.pattern(types.SourceUrlValidations)}
          {...sourceUrl.input.props}
        />
      </div>

      <div data-display="flex" data-wrap="nowrap" data-gap="12">
        <button
          type="submit"
          class="c-button"
          data-variant="primary"
          data-self="end"
          disabled={sourceUrl.unchanged || createSource.isLoading}
        >
          {t("source.create.submit")}
        </button>

        <UI.ClearButton
          disabled={sourceUrl.unchanged || createSource.isLoading}
          data-self="end"
          onClick={sourceUrl.clear}
        />
      </div>

      {createSource.isLoading && (
        <UI.Info data-mb="6">{t("source.create.waiting")}</UI.Info>
      )}
    </form>
  );
}
