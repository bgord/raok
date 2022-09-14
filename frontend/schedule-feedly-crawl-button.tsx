import { h } from "preact";
import { useMutation, useQueryClient } from "react-query";
import * as bg from "@bgord/frontend";

import * as api from "./api";

export function ScheduleFeedlyCrawlButton(
  props: h.JSX.IntrinsicElements["button"]
) {
  const t = bg.useTranslations();

  const queryClient = useQueryClient();
  const notify = bg.useToastTrigger();

  const scheduleFeedlyArticlesCrawl = useMutation(
    api.scheduleFeedlyArticlesCrawl,
    {
      onSuccess() {
        setTimeout(scheduleFeedlyArticlesCrawl.reset, 5000);
        notify({ message: "Feedly crawl scheduled" });
        queryClient.invalidateQueries("stats");
      },
      onError: (error: bg.ServerError) => {
        setTimeout(scheduleFeedlyArticlesCrawl.reset, 5000);
        notify({ message: t(error.message) });
      },
    }
  );

  return (
    <button
      type="button"
      onClick={() => scheduleFeedlyArticlesCrawl.mutate()}
      disabled={
        scheduleFeedlyArticlesCrawl.isLoading ||
        scheduleFeedlyArticlesCrawl.isSuccess
      }
      class="c-button"
      data-variant="bare"
      {...props}
    >
      {scheduleFeedlyArticlesCrawl.isIdle &&
        t("dashboard.schedule_feedly_crawl")}
      {scheduleFeedlyArticlesCrawl.isLoading && t("dashboard.scheduling")}
      {scheduleFeedlyArticlesCrawl.isSuccess && t("dashboard.scheduled")}
      {scheduleFeedlyArticlesCrawl.isError && t("dashboard.could_not_schedule")}
    </button>
  );
}
