import { RoutableProps } from "preact-router";
import { h } from "preact";
import { useQuery, useQueryClient, useMutation } from "react-query";
import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";

import * as UI from "./ui";
import * as api from "./api";
import * as types from "./types";
import * as hooks from "./hooks";

import { Source } from "./source";
import { SourceCreate } from "./source-create";

export type InitialSourcesDataType = {
  sources: types.SourceType[];
};

export function Sources(_props: RoutableProps) {
  hooks.useLeavingPrompt();

  const t = bg.useTranslations();
  const search = bg.useClientSearch();
  const queryClient = useQueryClient();
  const notify = bg.useToastTrigger();

  const sourceList = useQuery(api.keys.sources, () => api.Source.list(), {
    refetchOnMount: true,
  });

  const reorder = useMutation(api.Reordering.transfer, {
    onSuccess: () => {
      queryClient.invalidateQueries(api.keys.sources);
      notify({ message: "sources.reordered" });
    },
  });

  const sort = bg.useClientSort<types.SourceType>("sort-sources", {
    enum: types.SourceSortEnum,
    options: {
      [types.SourceSortEnum.default]: bg.defaultSortFn,
      [types.SourceSortEnum.used_at_most_recent]: (a, b) =>
        a.updatedAt.raw < b.updatedAt.raw ? 1 : -1,
      [types.SourceSortEnum.used_at_least_recent]: (a, b) =>
        a.updatedAt.raw > b.updatedAt.raw ? 1 : -1,
    },
  });

  const sources = bg.useReordering({
    correlationId: "sources",
    initialItems: (sourceList.data ?? [])
      .filter((source) => search.filterFn(String(source.url)))
      .toSorted(sort.sortFn),
    callback: reorder.mutate,
    enabled: sort.unchanged && search.unchanged,
  });

  const numberOfSources = sources.items.length;

  return (
    <main
      data-display="flex"
      data-direction="column"
      data-gap="12"
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

      <SourceCreate />

      <div
        data-display="flex"
        data-wrap="nowrap"
        data-max-width="100%"
        data-gap="12"
      >
        <div data-display="flex" data-direction="column">
          <label class="c-label" {...sort.label.props}>
            {t("sort")}
          </label>

          <UI.Select
            key={sort.value}
            value={sort.value}
            onInput={sort.onChange}
            {...sort.input.props}
          >
            {sort.options.map((option) => (
              <option key={option} value={option}>
                {t(`source.sort.${String(option)}`)}
              </option>
            ))}
          </UI.Select>
        </div>

        <div data-position="relative" data-grow="1" data-self="end">
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

      {sourceList.isSuccess && sources.items.length === 0 && (
        <UI.Info data-transform="upper-first">{t("source.list.empty")}</UI.Info>
      )}

      <datalist id="sources">
        {sourceList.data?.map((source) => (
          <option key={source} value={String(source.url)} />
        ))}
      </datalist>

      <ul
        data-display="flex"
        data-direction="column"
        data-gap="12"
        data-max-width="100%"
        data-my="24"
      >
        {sources.items.map((source, idx) => (
          <Source
            key={source.id}
            {...source}
            {...sources.props.item(idx)}
            {...sources.props.handle(idx)}
          />
        ))}
      </ul>
    </main>
  );
}
