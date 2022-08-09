import { h, Fragment, RefObject } from "preact";
import { useEffect, useRef } from "preact/hooks";
import * as bg from "@bgord/frontend";

function DialogOverlay(props: h.JSX.IntrinsicElements["div"]) {
  return (
    <div
      data-position="absolute"
      data-inset="0"
      data-display="flex"
      data-main="cross"
      data-cross="center"
      data-z="2"
      style={{ background: "rgb(0, 0, 0, 0.75)" }}
      {...props}
    />
  );
}

export function Dialog(
  props: bg.UseToggleReturnType & h.JSX.IntrinsicElements["dialog"]
) {
  const { disable, enable, on, off, toggle, ...rest } = props;
  const ref = useRef<HTMLDialogElement>(null);

  bg.useKeyboardShortcurts({ Escape: disable });
  bg.useClickOutside(ref, disable);

  if (props.off) return null;

  return (
    <>
      <DialogOverlay />

      <dialog
        ref={ref}
        open={props.on}
        data-display="flex"
        data-direction="column"
        data-position="absolute"
        data-z="2"
        data-bg="white"
        data-br="4"
        data-bc="gray-300"
        data-bw="1"
        data-p="24"
        data-mx="auto"
        {...rest}
      />
    </>
  );
}
