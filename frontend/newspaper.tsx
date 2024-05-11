import { h } from "preact";
import { useQuery, useQueryClient } from "react-query";
import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";

import * as UI from "./ui";
import * as api from "./api";
import * as types from "./types";

import { hasNewspaperStalled } from "../modules/newspapers/policies/common";
import { NewspaperArticle } from "./newspaper-article";
import { NewspaperCancel } from "./newspaper-cancel";
import { NewspaperArchive } from "./newspaper-archive";
import { NewspaperResend } from "./newspaper-resend";

type NewspaperProps = types.NewspaperType & h.JSX.IntrinsicElements["li"];

export function Newspaper(props: NewspaperProps) {
  const t = bg.useTranslations();
  const notify = bg.useToastTrigger();

  const details = bg.useToggle();
  useAutoUpdateNewspaper(props, details.enable);

  const sentAtRelative = props.sentAt?.relative ?? "-";

  const newspaperUrlCopied = bg.useRateLimiter({
    limitMs: bg.Time.Seconds(2).ms,
    action: () => notify({ message: "newspaper.url.copied" }),
  });

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
            <NewspaperCancel
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
              {...details.props.controller}
            >
              {details.off && <Icons.NavArrowLeft height="24" width="24" />}
              {details.on && <Icons.NavArrowDown height="24" width="24" />}
            </button>
          )}
        </div>
      </div>

      {details.on && props.status === "delivered" && (
        <div {...details.props.target}>
          <div data-display="flex" data-mt="12" data-mb="6">
            {["delivered", "error"].includes(props.status) && (
              <NewspaperResend {...details} {...props} />
            )}

            {["delivered", "error"].includes(props.status) && (
              <NewspaperArchive
                id={props.id}
                revision={props.revision}
                data-mr="12"
              />
            )}

            {props.status === "delivered" && (
              <UI.OutboundLink
                href={api.NewspaperLink.getDownload(props)}
                data-mr="auto"
              >
                <button type="button" class="c-button" data-variant="bare">
                  {t("newspaper.read_online")}
                </button>
              </UI.OutboundLink>
            )}

            {props.status === "delivered" && (
              <UI.CopyButton
                data-mr="6"
                options={{
                  text: api.NewspaperLink.getFull(props),
                  onSuccess: newspaperUrlCopied,
                }}
              />
            )}
          </div>
        </div>
      )}

      {details.on && (
        <ul data-mt="6" data-max-width="100%" {...details.props.target}>
          {props.articles.map((article) => (
            <NewspaperArticle key={article.id} {...article} />
          ))}
        </ul>
      )}
    </li>
  );
}

function useAutoUpdateNewspaper(
  props: types.NewspaperType,
  callback: VoidFunction = () => {}
) {
  const queryClient = useQueryClient();

  const hasCutoffPassed =
    Date.now() - props.scheduledAt > bg.Time.Minutes(3).ms;

  const shouldKeepAutoUpdating =
    // biome-ignore lint: lint/complexity/useSimplifiedLogicExpression
    !["delivered", "archived", "error"].includes(props.status) &&
    !hasCutoffPassed;

  useQuery(["newspapers", props.id], () => api.Newspaper.getSingle(props.id), {
    initialData: props,

    enabled: shouldKeepAutoUpdating,
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
