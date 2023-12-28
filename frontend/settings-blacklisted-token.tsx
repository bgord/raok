import * as bg from "@bgord/frontend";
import { h } from "preact";
import { useMutation, useQueryClient } from "react-query";

import * as api from "./api";
import * as UI from "./ui";
import * as types from "./types";

export function SettingsBlacklistedToken(props: types.TokenBlacklistType) {
  const queryClient = useQueryClient();
  const notify = bg.useToastTrigger<types.ToastType>();

  const deleteBlacklistedToken = useMutation(api.TokenBlacklist.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries(api.keys.tokenBlacklist);
      queryClient.invalidateQueries(api.keys.tokenBlacklistSuggestions);
      notify({ message: "blacklisted_token.deleted" });
    },
    onError: (error: bg.ServerError) => notify({ message: error.message }),
  });

  return (
    <UI.Badge
      data-display="flex"
      data-wrap="nowrap"
      data-main="center"
      data-cross="center"
      data-pl="12"
    >
      {props.token}

      <UI.ClearButton
        disabled={deleteBlacklistedToken.isLoading}
        onClick={() => deleteBlacklistedToken.mutate({ token: props.token })}
      />
    </UI.Badge>
  );
}
