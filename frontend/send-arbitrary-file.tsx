import { h, Fragment } from "preact";
import { useMutation } from "react-query";
import prettyBytes from "pretty-bytes-es5";
import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";

import * as api from "./api";
import * as UI from "./ui";
import { MAX_UPLOADED_FILE_SIZE_BYTES } from "../value-objects/max-uploaded-file-size";
import { FileMimeTypes } from "../value-objects/file-mime-types";

export function SendArbitraryFile() {
  const t = bg.useTranslations();
  const notify = bg.useToastTrigger();

  const fileUpload = useMutation(api.sendArbitraryFile, {
    onSuccess: () => notify({ message: "app.file.sent" }),
  });

  const file = bg.useFile("file", { maxSize: MAX_UPLOADED_FILE_SIZE_BYTES });

  return (
    <form
      data-bg="gray-100"
      data-p="12"
      data-shadow
      onSubmit={(event) => {
        event.preventDefault();

        if (fileUpload.isLoading) return;
        if (!file.isSelected) return;

        const form = new FormData();
        form.append("file", file.data);

        fileUpload.mutate(form);
      }}
    >
      <UI.Header data-display="flex" data-mb="24">
        <Icons.Book height="20" width="20" data-mr="6" />
        <span data-transform="upper-first">{t("app.send_a_file")}</span>
      </UI.Header>

      <div data-display="flex" data-gap="12">
        <input
          class="c-file-explorer"
          type="file"
          accept={FileMimeTypes.form()}
          onInput={file.actions.selectFile}
          {...file.input.props}
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

        <div data-display="flex" data-wrap="nowrap" data-gap="12">
          {file.isSelected && !fileUpload.isSuccess && (
            <button type="submit" class="c-button" data-variant="primary">
              {t("app.file.upload")}
            </button>
          )}

          {file.matches([bg.UseFileState.selected, bg.UseFileState.error]) && (
            <button
              type="button"
              class="c-button"
              data-variant="secondary"
              onClick={bg.exec([file.actions.clearFile, fileUpload.reset])}
            >
              {t("app.clear")}
            </button>
          )}
        </div>
      </div>

      {file.isError && (
        <UI.Info data-mt="24" data-color="red-400">
          {t("app.file.errors.too_big")}
        </UI.Info>
      )}

      {(fileUpload.isIdle || fileUpload.isSuccess) && file.isIdle && (
        <UI.Info data-gap="6" data-mt="24">
          <Icons.InfoEmpty height="20" width="20" />

          <span data-mt="3">
            {t("app.file.size.max", {
              value: prettyBytes(MAX_UPLOADED_FILE_SIZE_BYTES),
            })}
          </span>
        </UI.Info>
      )}

      {fileUpload.isIdle && file.isSelected && (
        <Fragment>
          <div
            data-mt="24"
            data-pr="12"
            data-fs="14"
            data-color="gray-500"
            data-transform="truncate"
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
