import { h, Fragment } from "preact";
import { useMutation } from "react-query";
import prettyBytes from "pretty-bytes-es5";

import { api } from "./api";
import { Header } from "./ui";
import { useFile, UseFileState } from "./hooks";
import { useNotificationTrigger } from "./notifications-context";

export function SendArbitraryFile() {
  const notify = useNotificationTrigger();

  const fileUpload = useMutation(api.sendArbitraryFile, {
    onSuccess: () => notify({ type: "success", message: "File sent" }),
  });

  const maxFileSizeInBytes = 5_000_000;
  const file = useFile({ maxSize: maxFileSizeInBytes });

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
        if (file.state !== UseFileState.selected) return;

        const form = new FormData();
        form.append("file", file.data);

        fileUpload.mutate(form);
      }}
    >
      <Header data-display="flex" data-mb="24">
        <img
          loading="eager"
          height="20"
          width="20"
          src="/icon-book.svg"
          alt=""
          data-mr="12"
        />
        Send a book
      </Header>

      <input
        id="file"
        name="file"
        accept=".txt,.html,.epub,.mobi"
        type="file"
        onInput={file.actions.selectFile}
        data-overflow="hidden"
        data-position="absolute"
        data-z="-1"
        style={{ width: "0.1px", height: "0.1px", opacity: "0" }}
      />

      <button
        id="file-explorer"
        name="file-explorer"
        disabled={file.state === UseFileState.selected}
        type="button"
        class="c-button"
        data-variant="secondary"
      >
        <label for="file">File explorer</label>
      </button>

      {file.state === UseFileState.selected && !fileUpload.isSuccess && (
        <button
          type="submit"
          class="c-button"
          data-variant="primary"
          data-ml="12"
        >
          Upload file
        </button>
      )}

      {[UseFileState.selected, UseFileState.error].includes(file.state) && (
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

      {file.state === UseFileState.error && (
        <div data-fs="14" data-mt="24" data-color="gray-600">
          This file is too big, please select another file
        </div>
      )}

      {(fileUpload.isIdle || fileUpload.isSuccess) &&
        file.state === UseFileState.idle && (
          <small data-mt="24" data-fs="14" data-color="gray-600">
            Select a file to send, up to {prettyBytes(maxFileSizeInBytes)}
          </small>
        )}
      {fileUpload.isIdle && file.state === UseFileState.selected && (
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
      {fileUpload.isSuccess && file.state === UseFileState.selected && (
        <div data-mt="24" data-fs="14" data-color="gray-600">
          File has been sent!
        </div>
      )}
      {fileUpload.isError && (
        <div data-mt="24" data-fs="14" data-color="gray-600">
          Please, try again.
        </div>
      )}
    </form>
  );
}
