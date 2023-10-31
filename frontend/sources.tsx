import { RoutableProps } from "preact-router";
import { h } from "preact";
import { useQuery } from "react-query";
import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";

import * as UI from "./ui";
import * as api from "./api";
import * as types from "./types";
import * as hooks from "./hooks";

import { Source } from "./source";

export type InitialSourcesDataType = {
  sources: types.SourceType[];
};

export function Sources(_props: RoutableProps) {
  hooks.useLeavingPrompt();
  const t = bg.useTranslations();
  const search = bg.useClientSearch();

  const sourceList = useQuery("sources", () => api.Source.list());

  const sources = (sourceList.data ?? []).filter((source) =>
    search.filterFn(String(source.url))
  );

  const numberOfSources = sources.length;

  return (
    <main
      data-display="flex"
      data-direction="column"
      data-gap="36"
      data-mt="24"
      data-mx="auto"
      data-md-pl="6"
      data-md-pr="3"
      data-max-width="768"
      data-md-max-width="100%"
      data-width="100%"
    >
      <div data-display="flex" data-gap="12" data-cross="center">
        <h2 data-fs="20" data-color="gray-800" data-fw="500">
          {t("app.sources")}
        </h2>

        <UI.Badge>{numberOfSources}</UI.Badge>
      </div>

      <div
        data-display="flex"
        data-wrap="nowrap"
        data-max-width="100%"
        data-gap="6"
      >
        <div data-position="relative" data-width="100%">
          <input
            list="articles"
            onInput={search.onChange}
            value={search.query}
            class="c-input"
            placeholder={t("source.search.placeholder")}
            data-width="100%"
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

        <UI.ClearButton onClick={search.clear} />
      </div>

      {sourceList.isSuccess && sources.length === 0 && (
        <UI.Info data-transform="upper-first">{t("source.list.empty")}</UI.Info>
      )}

      <datalist id="sources">
        {sourceList.data?.map((source) => (
          <option value={String(source.url)} />
        ))}
      </datalist>

      <ul data-display="flex" data-direction="column" data-max-width="100%">
        {sources.map((source) => (
          <Source key={source.id} {...source} />
        ))}
      </ul>
    </main>
  );
}
