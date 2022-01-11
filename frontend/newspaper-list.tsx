import { h } from "preact";
import { useQuery } from "react-query";

import { Header } from "./ui";
import { api } from "./api";
import { NewspaperType } from "./types";

import { Newspaper } from "./newspaper";

export function NewspaperList(props: { initialData: NewspaperType[] }) {
  const newspapers = useQuery(["newspapers"], api.getNewspapers, props);

  return (
    <section data-mt="48">
      <Header
        data-display="flex"
        data-cross="center"
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

      {newspapers.isSuccess && newspapers.data.length === 0 && (
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

      <ul data-mt="24">
        {newspapers.isSuccess &&
          newspapers.data.map((newspaper) => <Newspaper {...newspaper} />)}
      </ul>
    </section>
  );
}
