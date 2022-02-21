import { h } from "preact";
import { useQuery } from "react-query";
import { Anima } from "@bgord/frontend";

import * as api from "./api";
import { Header } from "./ui";
import { AnimaList, useAnimaList } from "./anima";
import { NewspaperType } from "./types";
import { Newspaper } from "./newspaper";

export function NewspaperList(props: { initialData: NewspaperType[] }) {
  const _newspapers = useQuery(["newspapers"], api.getNewspapers, props);

  const newspapers = useAnimaList(_newspapers.data ?? [], "head");

  return (
    <section data-mt="48" data-mb="72" data-md-mb="36">
      <Header
        data-display="flex"
        data-bg="gray-100"
        data-bct="gray-200"
        data-bwt="4"
        data-p="12"
      >
        <img
          loading="eager"
          height="20"
          width="20"
          src="/icon-newspaper.svg"
          alt=""
          data-mr="12"
        />
        Newspapers
      </Header>

      {newspapers.count === 0 && (
        <small
          data-fs="14"
          data-color="gray-600"
          data-md-px="12"
          data-mt="24"
          data-ml="6"
        >
          No newspapers added at the moment
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
