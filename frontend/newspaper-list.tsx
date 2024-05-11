import { h } from "preact";
import { useQuery } from "react-query";
import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";

import * as api from "./api";
import * as UI from "./ui";

import { Newspaper } from "./newspaper";

export function NewspaperList() {
  const t = bg.useTranslations();

  const newspapers = useQuery(api.keys.newspapers, api.Newspaper.list);

  if (!newspapers.data?.length) return null;

  return (
    <section data-my="24">
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

      <ul data-mt="24">
        {newspapers.data?.map((newspaper) => (
          <Newspaper key={newspaper.id} {...newspaper} />
        ))}
      </ul>
    </section>
  );
}
