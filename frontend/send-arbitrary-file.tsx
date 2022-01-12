import { h } from "preact";
import { useMutation } from "react-query";

import { api } from "./api";
import { Header } from "./ui";
import { useFile, UseFileState } from "./hooks";
import { useNotificationTrigger } from "./notifications-context";

const style = {
  width: "0.1px",
  height: "0.1px",
  opacity: "0",
  zIndex: "-1",
};

export function SendArbitraryFile() {
  const notify = useNotificationTrigger();

  const fileUpload = useMutation(api.sendArbitraryFile, {
    onSuccess: () => notify({ type: "success", message: "File sent" }),
  });
  const file = useFile();

  return (
    <form
      data-mt="48"
      data-bg="gray-100"
      data-p="12"
      data-bw="4"
      data-bct="gray-200"
      style={{ maxWidth: "480px" }}
      onSubmit={(event) => {
        event.preventDefault();

        if (fileUpload.isLoading) return;
        if (file.state !== UseFileState.selected) return;

        const form = new FormData();
        form.append("file", file.data);

        fileUpload.mutate(form);
      }}
    >
      <Header
        data-display="flex"
        data-cross="center"
        data-mb="24"
        data-color="gray-700"
      >
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
        style={style}
      />

      <button
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

      {file.state === UseFileState.selected && (
        <button
          type="button"
          class="c-button"
          data-variant="secondary"
          data-ml="12"
          onClick={() => {
            file.actions.clearFile();
            if (fileUpload.isSuccess) fileUpload.reset();
          }}
        >
          Clear
        </button>
      )}

      {(fileUpload.isIdle || fileUpload.isSuccess) &&
        file.state === UseFileState.idle && (
          <small data-mt="24" data-fs="14" data-color="gray-600">
            Select a file to send.
          </small>
        )}
      {fileUpload.isIdle && file.state === UseFileState.selected && (
        <div
          data-mt="24"
          data-pr="12"
          data-fs="14"
          data-color="gray-600"
          data-transform="truncate"
        >
          <strong data-color="gray-500">Selected file: </strong>
          {file.data.name}
        </div>
      )}
      {fileUpload.isSuccess && file.state === UseFileState.selected && (
        <div data-mt="24" data-fs="14" data-color="gray-600">
          File has been sent!
        </div>
      )}
      {fileUpload.isError && (
        <div data-mt="24" data-fs="14" data-color="gray-600">
          Pleasy, try again.
        </div>
      )}
    </form>
  );
}
