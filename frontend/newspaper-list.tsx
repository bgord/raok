import { h } from "preact";
import { useQuery } from "react-query";
import {
  Anima,
  AnimaList,
  useAnimaList,
  useTranslations,
} from "@bgord/frontend";
import { BookStack } from "iconoir-react";

import * as api from "./api";
import { Header } from "./ui";
import { NewspaperType } from "./types";
import { Newspaper } from "./newspaper";

export function NewspaperList() {
  const t = useTranslations();

  const _newspapers = useQuery("newspapers", api.getNewspapers, {
    refetchOnMount: false,
  });

  const newspapers = useAnimaList(_newspapers.data ?? [], {
    direction: "head",
  });

  return (
    <section data-mt="48" data-mb="72" data-md-mb="36">
      <Header
        data-display="flex"
        data-bg="gray-100"
        data-bct="gray-200"
        data-bwt="4"
        data-p="12"
      >
        <BookStack data-mr="12" />
        <span data-transform="upper-first">{t("app.newspapers")}</span>
      </Header>

      {newspapers.count === 0 && (
        <small
          data-fs="14"
          data-color="gray-600"
          data-md-px="12"
          data-mt="24"
          data-ml="6"
          data-transform="upper-first"
        >
          {t("dashboard.no_newspapers_available")}
        </small>
      )}

      <AnimaList data-mt="24">
        {newspapers.items.map((newspaper) => (
          <Anima key={newspaper.item.id} effect="opacity" {...newspaper.props}>
            <Newspaper {...newspaper.item} />
          </Anima>
        ))}
      </AnimaList>
    </section>
  );
}
