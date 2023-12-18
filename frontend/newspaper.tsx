import { h } from "preact";
import { useQuery, useMutation, useQueryClient } from "react-query";
import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";

import * as UI from "./ui";
import * as api from "./api";
import * as types from "./types";

import { hasNewspaperStalled } from "../modules/newspapers/policies/common";
import { NewspaperArticle } from "./newspaper-article";

type NewspaperProps = types.NewspaperType & h.JSX.IntrinsicElements["li"];

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
      data-max-width="100%"
      {...props}
    >
      <div data-display="flex" data-cross="center" data-max-width="100%">
        <UI.Badge
          data-bg="gray-600"
          data-color="gray-100"
          data-px="6"
          data-mr="12"
        >
          {t(`newspaper.status.${props.status}`)}
        </UI.Badge>

        <span data-fs="14">{props.title}</span>

        <div data-display="flex" data-cross="center" data-ml="auto">
          {(isStalled || props.status === "error") && (
            <CancelNewspaper
              id={props.id}
              revision={props.revision}
              data-mr="12"
            />
          )}

          {(props.status === "delivered" || sentAtRelative !== "-") && (
            <UI.Info
              data-display="flex"
              data-md-display="none"
              title={bg.DateFormatter.datetime(props.sentAt?.raw)}
            >
              {t("newspaper.sent_relative", { when: sentAtRelative })}
            </UI.Info>
          )}

          {["delivered", "archived"].includes(props.status) && (
            <button
              title={
                details.on
                  ? t("newspaper.details.hide")
                  : t("newspaper.details.show")
              }
              type="button"
              class="c-button"
              data-variant="bare"
              data-mx="6"
              onClick={details.toggle}
            >
              {details.off && <Icons.NavArrowDown height="24" width="24" />}
              {details.on && <Icons.NavArrowUp height="24" width="24" />}
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
            <button
              type="submit"
              class="c-button"
              data-variant="secondary"
              data-mr="12"
              onClick={() => {
                resendNewspaper.mutate({
                  id: props.id,
                  revision: props.revision,
                });
                details.disable();
              }}
            >
              {t("newspaper.resend")}
            </button>
          )}

          {["delivered", "error"].includes(props.status) && (
            <ArchiveNewspaper
              id={props.id}
              revision={props.revision}
              data-mr="12"
            />
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
  props: types.NewspaperType,
  callback: VoidFunction = () => {}
) {
  const queryClient = useQueryClient();

  const cutoff = bg.Time.Minutes(3).ms;
  const now = Date.now();
  const hasCutoffPassed = now - props.scheduledAt > cutoff;

  useQuery(["newspapers", props.id], () => api.Newspaper.getSingle(props.id), {
    initialData: props,

    enabled:
      !["delivered", "archived", "error"].includes(props.status) &&
      !hasCutoffPassed,

    refetchInterval: bg.Time.Seconds(1).ms,

    onSuccess(updated) {
      queryClient.setQueryData<types.NewspaperType[]>(
        "newspapers",
        (newspapers = []) =>
          newspapers.map((x) => (x.id === updated.id ? updated : x))
      );

      if (updated.status === "delivered") {
        queryClient.invalidateQueries(api.keys.articles);
        callback();
      }
    },
  });
}

function ArchiveNewspaper(
  props: Pick<types.NewspaperType, "id" | "revision"> &
    h.JSX.IntrinsicElements["button"]
) {
  const t = bg.useTranslations();

  const { id, ...rest } = props;

  const notify = bg.useToastTrigger();
  const queryClient = useQueryClient();

  const archiveNewspaper = useMutation(api.Newspaper.archive, {
    onSuccess: () => {
      queryClient.invalidateQueries(api.keys.newspapers);
      notify({ message: "newspaper.archived" });
    },
  });

  return (
    <button
      type="submit"
      class="c-button"
      data-variant="secondary"
      onClick={() =>
        archiveNewspaper.mutate({ id: props.id, revision: props.revision })
      }
      {...rest}
    >
      {t("newspaper.archive")}
    </button>
  );
}

function CancelNewspaper(
  props: Pick<types.NewspaperType, "id" | "revision"> &
    h.JSX.IntrinsicElements["button"]
) {
  const { id, ...rest } = props;

  const t = bg.useTranslations();
  const notify = bg.useToastTrigger();
  const queryClient = useQueryClient();

  const cancelNewspaper = useMutation(api.Newspaper.cancel, {
    onSuccess: () => {
      queryClient.invalidateQueries(api.keys.newspapers);
      queryClient.invalidateQueries(api.keys.articles);
      queryClient.invalidateQueries("archive-newspapers");
      notify({ message: "newspaper.cancelled" });
    },
  });

  return (
    <button
      type="submit"
      class="c-button"
      data-variant="secondary"
      onClick={() => cancelNewspaper.mutate({ id, revision: props.revision })}
      {...rest}
    >
      {t("app.cancel")}
    </button>
  );
}

function useResendNewspaper() {
  const queryClient = useQueryClient();
  const notify = bg.useToastTrigger();

  return useMutation(api.Newspaper.resend, {
    onSuccess: () => {
      queryClient.invalidateQueries(api.keys.newspapers);
      queryClient.invalidateQueries(api.keys.articles);
      queryClient.invalidateQueries(api.keys.stats);

      notify({ message: "newspaper.resent" });
    },
  });
}
