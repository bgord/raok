import { h, Fragment } from "preact";
import { useMutation } from "react-query";
import prettyBytes from "pretty-bytes-es5";
import { useFile, UseFileState, useToastTrigger } from "@bgord/frontend";
import { Book } from "iconoir-react";

import * as api from "./api";
import { MAX_UPLOADED_FILE_SIZE } from "../value-objects/max-uploaded-file-size";
import { Header } from "./ui";

export function SendArbitraryFile() {
  const notify = useToastTrigger();

  const fileUpload = useMutation(api.sendArbitraryFile, {
    onSuccess: () => notify({ message: "file.sent" }),
  });

  const file = useFile({ maxSize: MAX_UPLOADED_FILE_SIZE });

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
        <Book data-mr="12" />
        Send a book
      </Header>

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

      <button
        id="file-explorer"
        name="file-explorer"
        disabled={file.state === UseFileState.selected}
        type="button"
        class="c-button"
        data-variant="secondary"
      >
        <label htmlFor="file">File explorer</label>
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
            Select a file to send, up to {prettyBytes(MAX_UPLOADED_FILE_SIZE)}
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

      {fileUpload.isLoading && (
        <div data-mt="24" data-fs="14" data-color="gray-600">
          Loading...
        </div>
      )}
    </form>
  );
}
