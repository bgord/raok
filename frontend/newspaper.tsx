import { h, Fragment } from "preact";
import { useQuery, useMutation, useQueryClient } from "react-query";

import * as UI from "./ui";
import { api } from "./api";
import { NewspaperType } from "./types";
import { useAnimatiedToggle } from "./hooks";

import { hasNewspaperStalled } from "../policies/common";

type NewspaperProps = NewspaperType;

export function Newspaper(props: NewspaperProps) {
  const queryClient = useQueryClient();

  const resendNewspaper = useMutation(api.resendNewspaper, {
    onSuccess: () => {
      queryClient.invalidateQueries(["newspapers"]);
      queryClient.invalidateQueries(["articles"]);
      queryClient.invalidateQueries(["stats"]);
    },
  });

  const addArticleToFavourites = useMutation(api.addArticleToFavourites, {
    onSuccess: () => queryClient.invalidateQueries(["favourite-articles"]),
  });

  const details = useAnimatiedToggle();

  useAutoUpdateNewspaper(props, details.actions.show);

  const sentAt = props.sentAt ? new Date(props.sentAt).toLocaleString() : "-";
  const scheduledAt = new Date(props.scheduledAt).toLocaleString();

  const isStalled = hasNewspaperStalled({
    status: props.status,
    scheduledAt: props.scheduledAt,
  });

  return (
    <li
      data-display="flex"
      data-direction="column"
      data-mb="24"
      data-bc={details.state !== "hidden" && "gray-200"}
      data-bw="1"
      data-bcr="gray-100"
      data-bwr="4"
    >
      <div
        data-display="flex"
        data-cross="center"
        data-p={details.state !== "hidden" ? "12" : "0"}
      >
        <UI.Badge>{props.status}</UI.Badge>

        <span data-ml="12">Newspaper #{props.id.split("-")[0]}</span>

        <div data-ml="auto">
          {(isStalled || props.status === "error") && (
            <ArchiveNewspaper data-mr="12" id={props.id} />
          )}

          {props.status === "delivered" && (
            <span data-fs="14" data-color="gray-400" data-mr="6">
              Sent at {sentAt}
            </span>
          )}

          {props.status === "delivered" && (
            <button
              class="c-button"
              data-variant="bare"
              onClick={details.actions.toggle}
            >
              {["hidden", "appearing"].includes(details.state) && (
                <img
                  loading="eager"
                  height="16"
                  width="16"
                  src="/arrow-down-icon.svg"
                  alt=""
                />
              )}

              {["appeared", "hidding"].includes(details.state) && (
                <img
                  loading="eager"
                  height="16"
                  width="16"
                  src="/arrow-up-icon.svg"
                  alt=""
                />
              )}
            </button>
          )}
        </div>
      </div>

      {details.state !== "hidden" && (
        <div
          data-display="flex"
          data-mt="12"
          data-mb="24"
          data-px="12"
          {...details.props}
        >
          {["delivered", "error"].includes(props.status) && (
            <Fragment>
              <ArchiveNewspaper id={props.id} data-mr="12" />

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  resendNewspaper.mutate(props.id);
                  details.actions.hide();
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

      {details.state !== "hidden" && (
        <ol data-mt="6" data-mb="12" {...details.props}>
          {props.articles.map((article) => (
            <li
              data-display="flex"
              data-wrap="nowrap"
              data-mb="12"
              data-max-width="768"
              data-px="12"
              data-cross="center"
            >
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  addArticleToFavourites.mutate(article.id);
                }}
              >
                <button
                  type="submit"
                  class="c-button"
                  data-variant="bare"
                  data-mr="6"
                >
                  {article.favourite && (
                    <img
                      loading="eager"
                      height="20"
                      width="20"
                      src="/icon-star-filled.svg"
                      alt=""
                    />
                  )}
                  {!article.favourite && (
                    <img
                      loading="eager"
                      height="20"
                      width="20"
                      src="/icon-star.svg"
                      alt=""
                    />
                  )}
                </button>
              </form>

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

  const cutoff = 3 * 60 * 1000; // 3 minutes
  const now = Date.now();
  const hasCutoffPassed = now - props.scheduledAt > cutoff;

  useQuery(["newspapers", props.id], () => api.getSingleNewspaper(props.id), {
    initialData: props,
    enabled:
      !["delivered", "archived", "error"].includes(props.status) &&
      !hasCutoffPassed,
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

function ArchiveNewspaper(props: {
  id: NewspaperType["id"] & h.JSX.IntrinsicElements["form"];
}) {
  const { id, ...rest } = props;

  const queryClient = useQueryClient();

  const archiveNewspaper = useMutation(api.archiveNewspaper, {
    onSuccess: () => queryClient.invalidateQueries(["newspapers"]),
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        archiveNewspaper.mutate(id);
      }}
      {...rest}
    >
      <button type="submit" class="c-button" data-variant="secondary">
        Archive
      </button>
    </form>
  );
}
