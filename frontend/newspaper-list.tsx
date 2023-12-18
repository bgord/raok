import { h } from "preact";
import { useQuery } from "react-query";
import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";

import * as api from "./api";
import * as UI from "./ui";

import { Newspaper } from "./newspaper";

export function NewspaperList() {
  const t = bg.useTranslations();

  const _newspapers = useQuery(api.keys.newspapers, api.Newspaper.list);

  const newspapers = bg.useAnimaList(_newspapers.data ?? [], {
    direction: "head",
  });

  return (
    <section data-mt="48" data-mb="72" data-md-mb="36">
      <UI.Header
        data-display="flex"
        data-bg="gray-100"
        data-bct="gray-200"
        data-bwt="4"
        data-p="12"
      >
        <Icons.BookStack data-mr="12" />
        <span data-transform="upper-first">{t("app.newspapers")}</span>
      </UI.Header>

      {newspapers.count === 0 && (
        <UI.Info data-md-px="12" data-mt="24" data-ml="6">
          {t("dashboard.no_newspapers_available")}
        </UI.Info>
      )}

      <bg.AnimaList data-mt="24">
        {newspapers.items.map((newspaper) => (
          <bg.Anima
            key={newspaper.item.id}
            effect="opacity"
            {...newspaper.props}
          >
            <Newspaper {...newspaper.item} />
          </bg.Anima>
        ))}
      </bg.AnimaList>
    </section>
  );
}
