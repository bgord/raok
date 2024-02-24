import { useEffect } from "preact/hooks";
import { useIsFetching } from "react-query";
import * as bg from "@bgord/frontend";

export function useLeavingPrompt() {
  const numberOfRequestsInProgress = useIsFetching();
  bg.useLeavingPrompt(numberOfRequestsInProgress > 0);
}

export function useArticleUrlClipboardPreview() {
  const preview = bg.useField<string | null>("preview", null);

  useEffect(() => {
    if (!navigator || !navigator.clipboard || !navigator.clipboard.read) return;

    navigator.clipboard
      .read()
      .then(async (items) => {
        const candidates = await Promise.all(
          items
            .filter((item) => item.types.includes("text/plain"))
            .map((text) =>
              text.getType("text/plain").then((result) => result.text())
            )
        );

        const url = candidates.find((candidate) => {
          try {
            new URL(candidate);
            return true;
          } catch (error) {
            return false;
          }
        });

        preview.set(url ?? null);
      })
      .catch(preview.clear);
    /* eslint-disable react-hooks/exhaustive-deps */
  }, []);

  return preview;
}
