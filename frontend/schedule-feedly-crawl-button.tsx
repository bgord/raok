import { h } from "preact";
import { useMutation, useQueryClient } from "react-query";

import * as api from "./api";
import { useToastTrigger } from "./toasts-context";

export function ScheduleFeedlyCrawlButton(
  props: h.JSX.IntrinsicElements["button"]
) {
  const queryClient = useQueryClient();
  const notify = useToastTrigger();

  const scheduleFeedlyArticlesCrawl = useMutation(
    api.scheduleFeedlyArticlesCrawl,
    {
      onSuccess() {
        setTimeout(scheduleFeedlyArticlesCrawl.reset, 5000);
        notify({ type: "success", message: "Feedly crawl scheduled" });
        queryClient.invalidateQueries("stats");
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
      {scheduleFeedlyArticlesCrawl.isIdle && "Schedule Feedly crawl"}
      {scheduleFeedlyArticlesCrawl.isLoading && "Scheduling..."}
      {scheduleFeedlyArticlesCrawl.isSuccess && "Scheduled!"}
      {scheduleFeedlyArticlesCrawl.isError && "Couldn't schedule"}
    </button>
  );
}
