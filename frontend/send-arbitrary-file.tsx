import { h, Fragment } from "preact";
import { useMutation, useQuery } from "react-query";
import prettyBytes from "pretty-bytes-es5";
import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";

import * as api from "./api";
import * as UI from "./ui";
import * as types from "./types";

export function SendArbitraryFile() {
  const t = bg.useTranslations();
  const notify = bg.useToastTrigger();

  const deviceList = useQuery(api.keys.allDevices, api.Devices.list);
  const devices = deviceList.data ?? [];

  const deviceId = bg.useField<types.DeviceType["id"]>(
    "device-id",
    devices[0]?.id as types.DeviceType["id"],
  );

  const shortcut = bg.useFocusKeyboardShortcut("$mod+Control+KeyE");
  const fileUpload = useMutation(api.sendArbitraryFile, {
    onSuccess: () => notify({ message: "app.file.sent" }),
  });

  const file = bg.useFile("file", {
    maxSize: types.MAX_UPLOADED_FILE_SIZE_BYTES,
  });

  bg.useKeyboardShortcuts({
    Escape: bg.exec([file.actions.clearFile, fileUpload.reset, deviceId.clear]),
  });

  return (
    <form
      data-display="flex"
      data-direction="column"
      data-gap="6"
      data-p="12"
      data-bg="gray-100"
      data-shadow
      onSubmit={(event) => {
        event.preventDefault();

        if (fileUpload.isLoading) return;
        if (!file.isSelected) return;

        const form = new FormData();
        form.append("file", file.data);
        form.append("deviceId", deviceId.value);

        fileUpload.mutate(form);
      }}
    >
      <UI.Header data-display="flex">
        <Icons.Book height="20" width="20" data-mr="6" />
        <span data-transform="upper-first">{t("app.send_a_file")}</span>
      </UI.Header>

      <div
        data-display="flex"
        data-wrap="nowrap"
        data-cross="end"
        data-gap="12"
      >
        <div data-display="flex" data-direction="column">
          <label class="c-label" {...deviceId.label.props}>
            {t("send_a_file.device.label")}
          </label>

          <UI.Select
            key={devices.length}
            onInput={deviceId.handleChange}
            data-mr="auto"
            data-width="100%"
            {...deviceId.input.props}
            {...bg.Rhythm().times(12).style.minWidth}
          >
            {devices.map((device) => (
              <option key={device.id} value={device.id}>
                {device.name}
              </option>
            ))}
          </UI.Select>
        </div>

        <div data-display="flex" data-gap="12">
          <input
            class="c-file-explorer"
            type="file"
            accept={types.FileMimeTypes.form()}
            onInput={file.actions.selectFile}
            {...file.input.props}
            {...shortcut}
          />

          <label data-cursor="pointer" {...file.label.props}>
            <button
              disabled={file.isSelected}
              type="button"
              class="c-button"
              data-variant="secondary"
              data-pointer-events="none"
            >
              {t("app.file_explorer")}
            </button>
          </label>
        </div>
      </div>

      <div data-display="flex" data-wrap="nowrap" data-gap="6" data-mt="6">
        {file.isSelected && !fileUpload.isSuccess && (
          <button type="submit" class="c-button" data-variant="primary">
            {t("app.file.upload")}
          </button>
        )}

        {file.matches([bg.UseFileState.selected, bg.UseFileState.error]) && (
          <button
            type="button"
            class="c-button"
            data-variant="bare"
            onClick={bg.exec([
              file.actions.clearFile,
              fileUpload.reset,
              deviceId.clear,
            ])}
          >
            {t("app.clear")}
          </button>
        )}
      </div>

      {file.isError && (
        <UI.Info data-mt="24" data-color="red-400">
          {t("app.file.errors.too_big")}
        </UI.Info>
      )}

      {(fileUpload.isIdle || fileUpload.isSuccess) && file.isIdle && (
        <UI.Info data-gap="6">
          <Icons.InfoCircle height="20" width="20" />

          <span data-mt="3">
            {t("app.file.size.max", {
              value: prettyBytes(types.MAX_UPLOADED_FILE_SIZE_BYTES),
            })}
          </span>
        </UI.Info>
      )}

      {fileUpload.isIdle && file.isSelected && (
        <Fragment>
          <div
            data-mt="12"
            data-pr="12"
            data-fs="14"
            data-color="gray-500"
            data-transform="truncate"
            data-max-width="100%"
            title={file.data.name}
          >
            <strong>{t("app.file.name")}</strong>
            {file.data.name}
          </div>

          <div data-fs="14" data-color="gray-500">
            <strong>{t("app.file.size")}</strong>
            {prettyBytes(file.data.size)}
          </div>
        </Fragment>
      )}

      {fileUpload.isSuccess && file.isSelected && (
        <div data-mt="24" data-fs="14" data-color="gray-600">
          {t("app.file.sent")}
        </div>
      )}
      {fileUpload.isError && (
        <div data-mt="24" data-fs="14" data-color="gray-600">
          {t("app.file.try_again")}
        </div>
      )}

      {fileUpload.isLoading && (
        <div data-mt="24" data-fs="14" data-color="gray-600">
          {t("app.file.loading")}
        </div>
      )}
    </form>
  );
}
