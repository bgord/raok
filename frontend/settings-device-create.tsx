import * as bg from "@bgord/frontend";
import { h } from "preact";
import { useMutation, useQueryClient } from "react-query";

import * as api from "./api";
import * as types from "./types";
import * as UI from "./ui";

export function DeviceCreate() {
  const t = bg.useTranslations();
  const notify = bg.useToastTrigger();
  const queryClient = useQueryClient();

  const deviceName = bg.useField<types.DeviceType["name"]>("device-name", "");
  const deviceEmail = bg.useField<types.DeviceType["email"]>(
    "device-email",
    ""
  );

  const createDevice = useMutation(api.Devices.create, {
    onSuccess: () => {
      deviceName.clear();
      deviceEmail.clear();
      queryClient.invalidateQueries(api.keys.allDevices);
      notify({ message: "device.create.success" });
    },
    onError: (error: bg.ServerError) => notify({ message: error.message }),
  });

  return (
    <form
      data-display="flex"
      data-cross="end"
      data-gap="12"
      data-md-gap="12"
      data-mt="24"
      data-mb="12"
      onSubmit={(event) => {
        event.preventDefault();
        createDevice.mutate({
          name: deviceName.value,
          email: deviceEmail.value,
        });
      }}
    >
      <div
        data-display="flex"
        data-direction="column"
        data-wrap="nowrap"
        data-grow="1"
        data-gap="6"
        {...bg.Rhythm().times(30).style.maxWidth}
      >
        <label class="c-label" {...deviceName.label.props}>
          {t("device.name.label")}
        </label>
        <input
          class="c-input"
          type="text"
          data-grow="1"
          placeholder={t("device.name.placeholder")}
          onChange={deviceName.handleChange}
          value={deviceName.value}
          {...bg.Form.pattern(types.DeviceNameValidations)}
          {...deviceName.input.props}
        />
      </div>

      <div
        data-display="flex"
        data-direction="column"
        data-wrap="nowrap"
        data-grow="1"
        data-gap="6"
        {...bg.Rhythm().times(30).style.maxWidth}
      >
        <label class="c-label" {...deviceEmail.label.props}>
          {t("device.email.label")}
        </label>
        <input
          class="c-input"
          type="email"
          data-grow="1"
          placeholder={t("device.email.placeholder")}
          onChange={deviceEmail.handleChange}
          value={deviceEmail.value}
          {...deviceEmail.input.props}
        />
      </div>

      <div data-display="flex" data-wrap="nowrap" data-gap="12">
        <button
          type="submit"
          class="c-button"
          data-variant="primary"
          data-self="end"
          disabled={
            deviceName.unchanged ||
            deviceEmail.unchanged ||
            createDevice.isLoading
          }
        >
          {t("device.create.submit")}
        </button>

        <UI.ClearButton
          disabled={
            deviceName.unchanged ||
            deviceEmail.unchanged ||
            createDevice.isLoading
          }
          data-self="end"
          onClick={bg.exec([deviceName.clear, deviceEmail.clear])}
        />
      </div>

      {createDevice.isLoading && (
        <UI.Info data-mb="6">{t("device.create.waiting")}</UI.Info>
      )}
    </form>
  );
}
