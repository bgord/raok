import { h } from "preact";
import { useQuery, useMutation, useQueryClient } from "react-query";
import * as bg from "@bgord/frontend";
import { NavArrowUp, NavArrowDown } from "iconoir-react";

import * as UI from "./ui";
import * as api from "./api";
import { NewspaperType } from "./types";
import { hasNewspaperStalled } from "../policies/common";
import { NewspaperArticle } from "./newspaper-article";

type NewspaperProps = NewspaperType & h.JSX.IntrinsicElements["li"];

export function Newspaper(props: NewspaperProps) {
  const t = bg.useTranslations();

  const details = bg.useToggle();
  useAutoUpdateNewspaper(props, details.enable);

  const resendNewspaper = useResendNewspaper();

  const sentAtRelative = props.sentAt?.relative ?? "-";

  const isStalled = hasNewspaperStalled({
    status: props.status,
    scheduledAt: props.scheduledAt,
  });

  return (
    <li
      data-display="flex"
      data-direction="column"
      data-my="12"
      data-md-pl="3"
      {...props}
    >
      <div data-display="flex" data-cross="center">
        <UI.Badge
          data-bg="gray-600"
          data-color="gray-100"
          data-px="6"
          data-mr="12"
        >
          {props.status}
        </UI.Badge>

        <span data-md-fs="14">{props.title}</span>

        <div data-display="flex" data-cross="center" data-ml="auto">
          {(isStalled || props.status === "error") && (
            <CancelNewspaper data-mr="12" id={props.id} />
          )}

          {(props.status === "delivered" || sentAtRelative !== "-") && (
            <span
              data-md-display="none"
              data-fs="14"
              data-color="gray-400"
              title={bg.DateFormatter.datetime(props.sentAt?.raw)}
            >
              Sent {sentAtRelative}
            </span>
          )}

          {["delivered", "archived"].includes(props.status) && (
            <button
              type="button"
              class="c-button"
              data-variant="bare"
              data-mx="6"
              onClick={details.toggle}
            >
              {details.off && <NavArrowDown height="24" width="24" />}
              {details.on && <NavArrowUp height="24" width="24" />}
            </button>
          )}
        </div>
      </div>

      <bg.Anima
        visible={details.on && props.status === "delivered"}
        effect="opacity"
      >
        <div data-display="flex" data-mt="12" data-mb="6">
          {["delivered", "error"].includes(props.status) && (
            <form
              data-mr="12"
              onSubmit={(event) => {
                event.preventDefault();
                resendNewspaper.mutate(props.id);
                details.disable();
              }}
            >
              <button type="submit" class="c-button" data-variant="secondary">
                {t("newspaper.resend")}
              </button>
            </form>
          )}

          {["delivered", "error"].includes(props.status) && (
            <ArchiveNewspaper id={props.id} data-mr="12" />
          )}

          {props.status === "delivered" && (
            <UI.OutboundLink
              href={`/newspaper/${props.id}/read`}
              data-mr="auto"
            >
              <button type="button" class="c-button" data-variant="bare">
                {t("newspaper.read_online")}
              </button>
            </UI.OutboundLink>
          )}

          <span data-mt="6" data-fs="14" data-color="gray-400">
            Processed in {props.duration}
          </span>
        </div>
      </bg.Anima>

      <bg.Anima visible={details.on} effect="opacity">
        <ul data-mt="6" data-max-width="100%">
          {props.articles.map((article) => (
            <NewspaperArticle key={article.id} {...article} />
          ))}
        </ul>
      </bg.Anima>
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
        queryClient.invalidateQueries("articles");
        callback();
      }
    },
  });
}

function ArchiveNewspaper(props: {
  id: NewspaperType["id"] & h.JSX.IntrinsicElements["form"];
}) {
  const t = bg.useTranslations();

  const { id, ...rest } = props;

  const notify = bg.useToastTrigger();
  const queryClient = useQueryClient();

  const archiveNewspaper = useMutation(api.archiveNewspaper, {
    onSuccess: () => {
      queryClient.invalidateQueries("newspapers");
      notify({ message: "newspaper.archived" });
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
        {t("newspaper.archive")}
      </button>
    </form>
  );
}

function CancelNewspaper(props: {
  id: NewspaperType["id"] & h.JSX.IntrinsicElements["form"];
}) {
  const { id, ...rest } = props;

  const t = bg.useTranslations();
  const notify = bg.useToastTrigger();
  const queryClient = useQueryClient();

  const cancelNewspaper = useMutation(api.cancelNewspaper, {
    onSuccess: () => {
      queryClient.invalidateQueries("newspapers");
      notify({ message: "newspaper.cancelled" });
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
        {t("newspaper.cancel")}
      </button>
    </form>
  );
}

function useResendNewspaper() {
  const queryClient = useQueryClient();
  const notify = bg.useToastTrigger();

  return useMutation(api.resendNewspaper, {
    onSuccess: () => {
      queryClient.invalidateQueries("newspapers");
      queryClient.invalidateQueries("articles");
      queryClient.invalidateQueries("stats");

      notify({ message: "newspaper.resent" });
    },
  });
}
