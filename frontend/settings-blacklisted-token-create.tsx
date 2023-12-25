import * as bg from "@bgord/frontend";
import { h } from "preact";
import { useMutation, useQueryClient } from "react-query";

import * as api from "./api";
import * as types from "./types";
import * as UI from "./ui";

export function SettingsBlacklistedTokenCreate() {
  const t = bg.useTranslations();
  const notify = bg.useToastTrigger();
  const queryClient = useQueryClient();

  const token = bg.useField<types.TokenBlacklistType["token"]>("token", "");

  const createBlacklistedToken = useMutation(api.TokenBlacklist.create, {
    onSuccess: () => {
      token.clear();
      queryClient.invalidateQueries(api.keys.tokenBlacklist);
      notify({ message: "blacklisted_token.created" });
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
        createBlacklistedToken.mutate({ token: token.value });
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
        <label class="c-label" {...token.label.props}>
          {t("blacklisted_token.label")}
        </label>
        <input
          class="c-input"
          data-grow="1"
          placeholder={t("blacklisted_token.placeholder")}
          onChange={token.handleChange}
          value={token.value}
          {...bg.Form.pattern(types.BlacklistedTokenValidations)}
          {...token.input.props}
        />
      </div>

      <div data-display="flex" data-wrap="nowrap" data-gap="12">
        <button
          type="submit"
          class="c-button"
          data-variant="primary"
          data-self="end"
          disabled={token.unchanged || createBlacklistedToken.isLoading}
        >
          {t("blacklisted_token.create.submit")}
        </button>

        <UI.ClearButton
          disabled={token.unchanged || createBlacklistedToken.isLoading}
          data-self="end"
          onClick={token.clear}
        />
      </div>
    </form>
  );
}
