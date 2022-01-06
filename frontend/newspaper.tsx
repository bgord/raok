import { h } from "preact";
import { useMutation, useQueryClient } from "react-query";

import * as UI from "./ui";
import { api } from "./api";
import { NewspaperType } from "./types";
import { useToggle } from "./hooks";

type NewspaperProps = NewspaperType;

export function Newspaper(props: NewspaperProps) {
  const queryClient = useQueryClient();

  const archiveNewspaper = useMutation(api.archiveNewspaper, {
    onSuccess: () => queryClient.invalidateQueries(["newspapers"]),
  });

  const resendNewspaper = useMutation(api.resendNewspaper, {
    onSuccess: () => {
      queryClient.invalidateQueries(["newspapers"]);
      queryClient.invalidateQueries(["articles"]);
    },
  });

  const details = useToggle();

  return (
    <li data-display="flex" data-direction="column" data-mb="24">
      <div data-display="flex" data-cross="center">
        <UI.Badge>{props.status}</UI.Badge>

        <span data-ml="12">Newspaper #{props.number}</span>

        <div data-ml="auto">
          {props.status === "delivered" && (
            <span data-fs="14" data-color="gray-400" data-mr="6">
              Sent at {new Date(props.sentAt).toLocaleString()}
            </span>
          )}

          {details.off && (
            <button
              class="c-button"
              data-variant="bare"
              onClick={details.toggle}
            >
              <img height="16" width="16" src="/arrow-down-icon.svg" alt="" />
            </button>
          )}

          {details.on && (
            <button
              class="c-button"
              data-variant="bare"
              onClick={details.toggle}
            >
              <img height="16" width="16" src="/arrow-up-icon.svg" alt="" />
            </button>
          )}
        </div>
      </div>

      {details.on && (
        <div data-display="flex" data-mt="12" data-mb="24">
          {props.status === "delivered" && (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                archiveNewspaper.mutate(props.id);
              }}
              data-mr="24"
            >
              <button type="submit" class="c-button" data-variant="secondary">
                Archive
              </button>
            </form>
          )}

          {["delivered", "error"].includes(props.status) && (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                resendNewspaper.mutate(props.id);
              }}
            >
              <button type="submit" class="c-button" data-variant="primary">
                Resend
              </button>
            </form>
          )}

          <span data-fs="14" data-color="gray-400" data-ml="auto" data-mr="6">
            Scheduled at {new Date(props.scheduledAt).toLocaleString()}
          </span>
        </div>

        <ol data-mt="6" data-mb="12">
          {props.articles.map((article) => (
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
      )}
    </li>
  );
}
