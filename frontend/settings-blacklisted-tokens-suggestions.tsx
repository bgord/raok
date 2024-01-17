import * as bg from "@bgord/frontend";
import { h } from "preact";
import { useQuery, useMutation, useQueryClient } from "react-query";

import * as UI from "./ui";
import * as api from "./api";

export function SettingsBlacklistedTokensSuggestions() {
  const t = bg.useTranslations();
  const queryClient = useQueryClient();
  const notify = bg.useToastTrigger();

  const blacklistedTokensSuggestions = useQuery(
    api.keys.tokenBlacklistSuggestions,
    api.TokenBlacklist.listSuggestions,
  );

  const createBlacklistedToken = useMutation(api.TokenBlacklist.create, {
    onSuccess: () => {
      queryClient.invalidateQueries(api.keys.tokenBlacklist);
      queryClient.invalidateQueries(api.keys.tokenBlacklistSuggestions);
      notify({ message: "blacklisted_token.created" });
    },
    onError: (error: bg.ServerError) => notify({ message: error.message }),
  });

  const dismissBlacklistedTokenSuggestion = useMutation(
    api.TokenBlacklist.dismissSuggestion,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(api.keys.tokenBlacklist);
        queryClient.invalidateQueries(api.keys.tokenBlacklistSuggestions);
        notify({ message: "blacklisted_token.dismissed" });
      },
      onError: (error: bg.ServerError) => notify({ message: error.message }),
    },
  );

  const suggestions = blacklistedTokensSuggestions.data ?? [];

  if (blacklistedTokensSuggestions.isLoading) return null;
  if (suggestions.length === 0) return null;

  return (
    <div data-display="flex" data-gap="12" data-cross="center">
      <UI.Info>{t("blacklisted_token.suggestions")}</UI.Info>

      {suggestions.map((suggestion) => (
        <div
          data-display="flex"
          data-main="center"
          data-cross="center"
          key={suggestion.token}
        >
          <button
            class="c-button"
            type="button"
            data-variant="bare"
            onClick={() =>
              createBlacklistedToken.mutate({ token: suggestion.token })
            }
          >
            {suggestion.token}
          </button>

          <UI.ClearButton
            disabled={dismissBlacklistedTokenSuggestion.isLoading}
            onClick={() =>
              dismissBlacklistedTokenSuggestion.mutate(suggestion.token)
            }
          />
        </div>
      ))}
    </div>
  );
}
