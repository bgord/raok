import { h, Fragment } from "preact";
import { useMutation } from "react-query";

import { api } from "./api";
import { Header } from "./ui";
import { useFile, UseFileState } from "./hooks";

const style = {
  width: "0.1px",
  height: "0.1px",
  opacity: "0",
  overflow: "hidden",
  position: "absolute",
  zIndex: "-1",
};

export function SendArbitraryFile() {
  const fileUpload = useMutation(api.sendArbitraryFile);
  const file = useFile();

  return (
    <form
      data-mt="24"
      data-bg="gray-100"
      data-p="12"
      onSubmit={(event) => {
        event.preventDefault();

        if (file.state !== UseFileState.selected) return;

        const form = new FormData();
        form.append("file", file.data);

        fileUpload.mutate(form);
      }}
    >
      <Header data-mb="24">Send arbitrary file</Header>

      <input
        id="file"
        name="file"
        accept=".txt,.html,.epub,.mobi"
        type="file"
        onInput={file.actions.selectFile}
        style={style}
      />

      <button
        disabled={file.state === UseFileState.selected}
        type="button"
        class="c-button"
        data-variant="secondary"
      >
        <label for="file">Choose a file</label>
      </button>

      {file.state === UseFileState.selected && (
        <Fragment>
          <button
            type="submit"
            class="c-button"
            data-variant="primary"
            data-ml="12"
          >
            Upload file
          </button>

          <button
            type="button"
            class="c-button"
            data-variant="secondary"
            data-ml="12"
            onClick={file.actions.clearFile}
          >
            Clear
          </button>
        </Fragment>
      )}

      <div data-mt="24">{file.state}</div>
    </form>
  );
}
