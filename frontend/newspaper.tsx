import { h, Fragment } from "preact";
import { useQuery, useMutation, useQueryClient } from "react-query";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import formatDistanceStrict from "date-fns/formatDistanceStrict";

import * as UI from "./ui";
import { api } from "./api";
import { NewspaperType } from "./types";
import { useAnimatiedToggle } from "./hooks";
import { useNotificationTrigger } from "./notifications-context";
import { hasNewspaperStalled } from "../policies/common";
import { NewspaperArticle } from "./newspaper-article";

type NewspaperProps = NewspaperType;

export function Newspaper(props: NewspaperProps) {
  const details = useAnimatiedToggle();
  useAutoUpdateNewspaper(props, details.actions.show);

  const resendNewspaper = useResendNewspaper();

  const sentAtDate = props.sentAt
    ? new Date(props.sentAt).toLocaleString()
    : "-";

  const sentAtRelative = props.sentAt
    ? formatDistanceToNow(props.sentAt, { addSuffix: true })
    : "-";

  const duration = formatDistanceStrict(props.sentAt ?? 0, props.scheduledAt);

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
        <UI.Badge data-bg="gray-600" data-color="gray-100" data-px="6">
          {props.status}
        </UI.Badge>

        <span data-ml="12">Newspaper #{props.id.split("-")[0]}</span>

        <div data-display="flex" data-cross="center" data-ml="auto">
          {(isStalled || props.status === "error") && (
            <CancelNewspaper data-mr="12" id={props.id} />
          )}

          {(props.status === "delivered" || sentAtRelative !== "-") && (
            <span
              data-fs="14"
              data-color="gray-400"
              data-mr="12"
              title={sentAtDate}
            >
              Sent {sentAtRelative}
            </span>
          )}

          {["delivered", "archived"].includes(props.status) && (
            <button
              class="c-button"
              data-variant="bare"
              data-mr="6"
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

      {details.state !== "hidden" && props.status === "delivered" && (
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
            Processed in {duration}
          </span>
        </div>
      )}

      {details.state !== "hidden" && (
        <ol data-mt="6" data-mb="12" {...details.props}>
          {props.articles.map((article) => (
            <NewspaperArticle key={article.id} {...article} />
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

  const notify = useNotificationTrigger();
  const queryClient = useQueryClient();

  const archiveNewspaper = useMutation(api.archiveNewspaper, {
    onSuccess: () => {
      queryClient.invalidateQueries(["newspapers"]);
      notify({ type: "success", message: "Newspaper archived" });
    },
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

function CancelNewspaper(props: {
  id: NewspaperType["id"] & h.JSX.IntrinsicElements["form"];
}) {
  const { id, ...rest } = props;

  const notify = useNotificationTrigger();
  const queryClient = useQueryClient();

  const cancelNewspaper = useMutation(api.cancelNewspaper, {
    onSuccess: () => {
      queryClient.invalidateQueries(["newspapers"]);
      notify({ type: "success", message: "Newspaper cancelled" });
    },
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        cancelNewspaper.mutate(id);
      }}
      {...rest}
    >
      <button type="submit" class="c-button" data-variant="secondary">
        Cancel
      </button>
    </form>
  );
}

function useResendNewspaper() {
  const queryClient = useQueryClient();
  const notify = useNotificationTrigger();

  return useMutation(api.resendNewspaper, {
    onSuccess: () => {
      queryClient.invalidateQueries(["newspapers"]);
      queryClient.invalidateQueries(["articles"]);
      queryClient.invalidateQueries(["stats"]);

      notify({ type: "success", message: "Newspaper resent" });
    },
  });
}
