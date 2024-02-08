import { h } from "preact";
import { useQuery } from "react-query";
import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";

import * as UI from "./ui";
import * as api from "./api";
import * as types from "./types";
import * as hooks from "./hooks";

import { SettingsBlacklistedToken } from "./settings-blacklisted-token";
import { SettingsBlacklistedTokenCreate } from "./settings-blacklisted-token-create";
import { SettingsBlacklistedTokensSuggestions } from "./settings-blacklisted-tokens-suggestions";

export function SettingsTokenBlacklist() {
  hooks.useLeavingPrompt();

  const t = bg.useTranslations();
  const search = bg.useClientSearch();
  const shortcut = bg.useFocusKeyboardShortcut("$mod+Control+KeyS");

  const tokenBlacklist = useQuery(
    api.keys.tokenBlacklist,
    api.TokenBlacklist.list,
  );

  const sort = bg.useClientSort<types.TokenBlacklistType>(
    "sort-token-blacklist",
    {
      enum: types.SourceSortEnum,
      options: {
        [types.SourceSortEnum.default]: bg.defaultSortFn,
        [types.SourceSortEnum.a_z]: (a, b) => bg.Sorts.aToZ(a.token, b.token),
        [types.SourceSortEnum.z_a]: (a, b) => bg.Sorts.zToA(a.token, b.token),
      },
    },
  );

  const tokens = (tokenBlacklist.data ?? [])
    .filter((token) => search.filterFn(token.token))
    .toSorted(sort.sortFn);

  return (
    <main
      data-display="flex"
      data-direction="column"
      data-mt="24"
      data-mx="auto"
      data-max-width="768"
      data-md-max-width="100%"
      data-width="100%"
    >
      <div data-display="flex" data-gap="12" data-cross="center">
        <UI.Badge>{tokens.length}</UI.Badge>
        <div data-fs="14" data-color="gray-600">
          {t("app.token_blacklist")}
        </div>
      </div>

      <SettingsBlacklistedTokenCreate />

      <div
        data-display="flex"
        data-wrap="nowrap"
        data-max-width="100%"
        data-gap="12"
        data-md-gap="3"
      >
        <div
          data-display="flex"
          data-cross="center"
          data-md-direction="column"
          data-gap="12"
          data-wrap="nowrap"
          data-md-gap="3"
        >
          <label class="c-label" {...sort.label.props} data-transform="nowrap">
            {t("sort")}
          </label>

          <UI.Select
            key={sort.value}
            value={sort.value}
            onInput={sort.handleChange}
            {...sort.input.props}
          >
            {sort.options.map((option) => (
              <option key={option} value={option}>
                {t(`source.sort.${option}`)}
              </option>
            ))}
          </UI.Select>
        </div>

        <div
          data-position="relative"
          data-grow="1"
          data-self="end"
          data-width="100%"
        >
          <input
            onInput={search.onChange}
            value={search.query}
            class="c-input"
            placeholder={t("token_blacklist.search.placeholder")}
            data-width="100%"
            {...shortcut}
          />
          <Icons.Search
            height="34"
            width="34"
            data-position="absolute"
            data-p="6"
            data-top="0"
            data-right="0"
          />
        </div>

        <button
          type="button"
          class="c-button"
          data-variant="bare"
          data-self="end"
          onClick={bg.exec([search.clear, sort.clear])}
          disabled={search.unchanged && sort.unchanged}
        >
          {t("app.reset")}
        </button>
      </div>

      {tokenBlacklist.isSuccess && tokens.length === 0 && (
        <UI.Info data-mt="12" data-transform="upper-first">
          {t("token_blacklist.list.empty")}
        </UI.Info>
      )}

      <datalist id="token_blacklist">
        {tokenBlacklist.data?.map((source) => (
          <option key={source} value={String(source.token)} />
        ))}
      </datalist>

      <ul data-display="flex" data-gap="12" data-my="24">
        {tokens.map((token) => (
          <SettingsBlacklistedToken key={token.token} {...token} />
        ))}
      </ul>

      <SettingsBlacklistedTokensSuggestions />
    </main>
  );
}
