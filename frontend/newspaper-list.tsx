import { h } from "preact";
import { useMutation, useQuery, useQueryClient } from "react-query";

import * as UI from "./ui";
import { NewspaperType } from "./types";

export function NewspaperList() {
  const queryClient = useQueryClient();

  const newspapers = useQuery(
    ["newspapers"],
    async (): Promise<NewspaperType[]> =>
      fetch("/newspapers", {
        method: "GET",
        mode: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
      }).then((response) => (response.ok ? response.json() : [])),
    { initialData: [] }
  );

  const archiveNewspaper = useMutation(
    async (newspaperId: NewspaperType["id"]) =>
      fetch(`/archive-newspaper/${newspaperId}`, {
        method: "POST",
        mode: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
      }),
    { onSuccess: () => queryClient.invalidateQueries(["newspapers"]) }
  );

  const resendNewspaper = useMutation(
    async (newspaperId: NewspaperType["id"]) =>
      fetch(`/resend-newspaper/${newspaperId}`, {
        method: "POST",
        mode: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["newspapers"]);
        queryClient.invalidateQueries(["articles"]);
      },
    }
  );

  return (
    <section data-mt="48">
      <div
        data-display="flex"
        data-cross="center"
        data-bg="gray-100"
        data-bw="1"
        data-bc="gray-200"
        data-p="12"
      >
        <h2 data-fs="16" data-color="gray-800" data-fw="500">
          Newspapers
        </h2>
      </div>

      {newspapers.isSuccess && newspapers.data.length === 0 && (
        <small data-md-px="12" data-mt="12" data-ml="6">
          No newspapers added at the moment
        </small>
      )}

      <ul data-mt="24">
        {newspapers.isSuccess &&
          newspapers.data.map((newspaper) => (
            <li data-display="flex" data-direction="column" data-mb="24">
              <div data-display="flex" data-cross="center">
                <UI.Badge>{newspaper.status}</UI.Badge>
                <span data-ml="12">Newspaper #{newspaper.number}</span>

                <div data-ml="auto">
                  {newspaper.status === "delivered" && (
                    <span data-fs="14" data-color="gray-400" data-mr="6">
                      Sent at {new Date(newspaper.sentAt).toLocaleString()}
                    </span>
                  )}

                  <button
                    data-status="visible"
                    class="c-button"
                    data-variant="bare"
                  >
                    <img
                      height="16"
                      width="16"
                      src="/arrow-down-icon.svg"
                      alt=""
                    />
                  </button>

                  <button
                    data-status="hidden"
                    class="c-button"
                    data-variant="bare"
                  >
                    <img
                      height="16"
                      width="16"
                      src="/arrow-up-icon.svg"
                      alt=""
                    />
                  </button>
                </div>
              </div>

              <div>
                <div data-display="flex" data-mt="12" data-mb="24">
                  {newspaper.status === "delivered" && (
                    <form
                      onSubmit={(event) => {
                        event.preventDefault();
                        archiveNewspaper.mutate(newspaper.id);
                      }}
                      data-mr="24"
                    >
                      <button
                        type="submit"
                        class="c-button"
                        data-variant="secondary"
                      >
                        Archive
                      </button>
                    </form>
                  )}

                  {["delivered", "error"].includes(newspaper.status) && (
                    <form
                      onSubmit={(event) => {
                        event.preventDefault();
                        resendNewspaper.mutate(newspaper.id);
                      }}
                    >
                      <button
                        type="submit"
                        class="c-button"
                        data-variant="primary"
                      >
                        Resend
                      </button>
                    </form>
                  )}

                  <span
                    data-fs="14"
                    data-color="gray-400"
                    data-ml="auto"
                    data-mr="6"
                  >
                    Scheduled at{" "}
                    {new Date(newspaper.scheduledAt).toLocaleString()}
                  </span>
                </div>

                <ol data-mt="6" data-mb="12">
                  {newspaper.articles.map((article) => (
                    <li
                      data-display="flex"
                      data-wrap="nowrap"
                      data-mb="12"
                      data-max-width="768"
                    >
                      <UI.Link href={article.url} data-pr="12">
                        {article.url}
                      </UI.Link>

                      <UI.Badge data-ml="auto" data-mr="12">
                        {article.source}
                      </UI.Badge>
                    </li>
                  ))}
                </ol>
              </div>
            </li>
          ))}
      </ul>
    </section>
  );
}
