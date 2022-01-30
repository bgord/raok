import { h, Fragment } from "preact";
import { useQuery, useMutation, useQueryClient } from "react-query";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import formatDistanceStrict from "date-fns/formatDistanceStrict";

import * as UI from "./ui";
import { api } from "./api";
import { Anima } from "./anima";
import { NewspaperType } from "./types";
import { useToggle } from "./hooks";
import { useNotificationTrigger } from "./notifications-context";
import { hasNewspaperStalled } from "../policies/common";
import { NewspaperArticle } from "./newspaper-article";

type NewspaperProps = NewspaperType;

export function Newspaper(props: NewspaperProps) {
  const details = useToggle();
  useAutoUpdateNewspaper(props, details.enable);

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
      data-my="12"
      data-bcr="gray-100"
      data-bwr="4"
    >
      <div data-display="flex" data-cross="center">
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
              onClick={details.toggle}
            >
              {details.off && (
                <img
                  loading="eager"
                  height="16"
                  width="16"
                  src="/arrow-down-icon.svg"
                  alt=""
                />
              )}

              {details.on && (
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

      <Anima
        visible={details.on && props.status === "delivered"}
        style="opacity"
      >
        <div data-display="flex" data-my="24" data-pr="6">
          {["delivered", "error"].includes(props.status) && (
            <Fragment>
              <ArchiveNewspaper id={props.id} data-mr="12" />

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  resendNewspaper.mutate(props.id);
                  details.disable();
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
      </Anima>

      <Anima visible={details.on} style="opacity">
        <ol data-mt="6" data-mb="24">
          {props.articles.map((article) => (
            <NewspaperArticle key={article.id} {...article} />
          ))}
        </ol>
      </Anima>
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
