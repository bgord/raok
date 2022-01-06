import { h, Fragment } from "preact";
import { useQuery, useMutation, useQueryClient } from "react-query";

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

  useAutoUpdateNewspaper(props, details.setOn);

  const sentAt = new Date(props.sentAt).toLocaleString();
  const scheduledAt = new Date(props.scheduledAt).toLocaleString();

  return (
    <li data-display="flex" data-direction="column" data-mb="24">
      <div data-display="flex" data-cross="center">
        <UI.Badge>{props.status}</UI.Badge>

        <span data-ml="12">Newspaper #{props.id.split("-")[0]}</span>

        <div data-ml="auto">
          {props.status === "delivered" && (
            <span data-fs="14" data-color="gray-400" data-mr="6">
              Sent at {sentAt}
            </span>
          )}

          {details.off && props.status === "delivered" && (
            <button
              class="c-button"
              data-variant="bare"
              onClick={details.toggle}
            >
              <img height="16" width="16" src="/arrow-down-icon.svg" alt="" />
            </button>
          )}

          {details.on && props.status === "delivered" && (
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
          {["delivered", "error"].includes(props.status) && (
            <Fragment>
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
            </Fragment>
          )}

          <span data-fs="14" data-color="gray-400" data-ml="auto" data-mr="6">
            Scheduled at {scheduledAt}
          </span>
        </div>
      )}

      {details.on && props.status === "delivered" && (
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

              <UI.Badge data-ml="auto">{article.source}</UI.Badge>
            </li>
          ))}
        </ol>
      )}
    </li>
  );
}

function useAutoUpdateNewspaper(
  props: NewspaperType,
  callback: VoidFunction = () => {}
) {
  const queryClient = useQueryClient();

  useQuery(["newspapers", props.id], () => api.getSingleNewspaper(props.id), {
    initialData: props,
    enabled: !["delivered", "archived", "error"].includes(props.status),
    refetchInterval: 1000,
    onSuccess(updated) {
      queryClient.setQueryData<NewspaperType[]>(
        "newspapers",
        (newspapers = []) =>
          newspapers.map((x) => (x.id === updated.id ? updated : x))
      );

      if (updated.status === "delivered") {
        queryClient.invalidateQueries(["articles"]);
        callback();
      }
    },
  });
}
