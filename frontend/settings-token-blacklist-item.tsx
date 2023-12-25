import * as bg from "@bgord/frontend";
import { h } from "preact";
import { useMutation, useQueryClient } from "react-query";

import * as api from "./api";
import * as UI from "./ui";
import * as types from "./types";

export function SettingsTokenBlacklistItem(props: types.TokenBlacklistType) {
  const queryClient = useQueryClient();
  const notify = bg.useToastTrigger<types.ToastType>();

  const deleteTokenBlacklist = useMutation(api.TokenBlacklist.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries(api.keys.tokenBlacklist);
      notify({ message: "token_blacklist.deleted" });
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
        disabled={deleteTokenBlacklist.isLoading}
        onClick={() => deleteTokenBlacklist.mutate({ token: props.token })}
      />
    </UI.Badge>
  );
}
