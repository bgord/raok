import { h, Fragment } from "preact";
import { useMutation } from "react-query";
import prettyBytes from "pretty-bytes-es5";
import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";

import * as api from "./api";
import * as UI from "./ui";
import { MAX_UPLOADED_FILE_SIZE_BYTES } from "../value-objects/max-uploaded-file-size";

export function SendArbitraryFile() {
  const t = bg.useTranslations();
  const notify = bg.useToastTrigger();

  const fileUpload = useMutation(api.sendArbitraryFile, {
    onSuccess: () => notify({ message: "file.sent" }),
  });

  const file = bg.useFile({ maxSize: MAX_UPLOADED_FILE_SIZE_BYTES });

  return (
    <form
      data-mt="48"
      data-bg="gray-100"
      data-p="12"
      data-bw="4"
      data-bct="gray-200"
      onSubmit={(event) => {
        event.preventDefault();

        if (fileUpload.isLoading) return;
        if (file.state !== bg.UseFileState.selected) return;

        const form = new FormData();
        form.append("file", file.data);

        fileUpload.mutate(form);
      }}
    >
      <UI.Header data-display="flex" data-mb="24">
        <Icons.Book data-mr="12" />
        <span data-transform="upper-first">{t("app.send_a_book")}</span>
      </UI.Header>

      <input
        id="file"
        name="file"
        accept=".txt,.html,.epub"
        type="file"
        onInput={file.actions.selectFile}
        data-overflow="hidden"
        data-position="absolute"
        data-z="-1"
        style={{ width: "0.1px", height: "0.1px", opacity: "0" }}
      />

      <label htmlFor="file" data-cursor="pointer">
        <button
          id="file-explorer"
          name="file-explorer"
          disabled={file.state === bg.UseFileState.selected}
          type="button"
          class="c-button"
          data-variant="secondary"
          data-pointer-events="none"
        >
          {t("app.file_explorer")}
        </button>
      </label>

      {file.state === bg.UseFileState.selected && !fileUpload.isSuccess && (
        <button
          type="submit"
          class="c-button"
          data-variant="primary"
          data-ml="12"
        >
          Upload file
        </button>
      )}

      {[bg.UseFileState.selected, bg.UseFileState.error].includes(
        file.state
      ) && (
        <button
          type="button"
          class="c-button"
          data-variant="secondary"
          data-ml="12"
          onClick={() => {
            file.actions.clearFile();
            fileUpload.reset();
          }}
        >
          Clear
        </button>
      )}

      {file.state === bg.UseFileState.error && (
        <div data-fs="14" data-mt="24" data-color="gray-600">
          This file is too big, please select another file
        </div>
      )}

      {(fileUpload.isIdle || fileUpload.isSuccess) &&
        file.state === bg.UseFileState.idle && (
          <small data-mt="24" data-fs="14" data-color="gray-600">
            {`Select a file to send, up to ${prettyBytes(
              MAX_UPLOADED_FILE_SIZE_BYTES
            )}`}
          </small>
        )}

      {fileUpload.isIdle && file.state === bg.UseFileState.selected && (
        <Fragment>
          <div
            data-mt="24"
            data-pr="12"
            data-fs="14"
            data-color="gray-600"
            data-transform="truncate"
            title={file.data.name}
          >
            <strong data-color="gray-500">File: </strong>
            {file.data.name}
          </div>

          <div data-fs="14" data-color="gray-500">
            <strong>Size: </strong> {prettyBytes(file.data.size)}
          </div>
        </Fragment>
      )}

      {fileUpload.isSuccess && file.state === bg.UseFileState.selected && (
        <div data-mt="24" data-fs="14" data-color="gray-600">
          File has been sent!
        </div>
      )}
      {fileUpload.isError && (
        <div data-mt="24" data-fs="14" data-color="gray-600">
          Please, try again.
        </div>
      )}

      {fileUpload.isLoading && (
        <div data-mt="24" data-fs="14" data-color="gray-600">
          Loading...
        </div>
      )}
    </form>
  );
}
