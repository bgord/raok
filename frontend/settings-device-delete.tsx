import { h } from "preact";
import { useMutation, useQueryClient } from "react-query";
import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";

import * as api from "./api";
import * as types from "./types";

export function SettingsDeviceDelete(props: types.DeviceType) {
  const t = bg.useTranslations();
  const queryClient = useQueryClient();
  const notify = bg.useToastTrigger<types.ToastType>();

  const deleteSettingsDevice = useMutation(api.Devices.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries(api.keys.allDevices);
      notify({ message: "device.deleted" });
    },
    onError: (error: bg.ServerError) => notify({ message: error.message }),
  });

  return (
    <button
      type="submit"
      title={t("device.delete")}
      class="c-button"
      data-variant="bare"
      onClick={() => deleteSettingsDevice.mutate(props)}
      {...bg.Rhythm().times(2).style.height}
    >
      <Icons.XmarkSquare width="20" height="20" />
    </button>
  );
}
