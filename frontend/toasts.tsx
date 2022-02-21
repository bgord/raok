import { h } from "preact";

import { AnimaList, Anima, useAnimaList } from "./anima";
import { useToasts } from "./toasts-context";

export function Toasts() {
  const [_toasts] = useToasts();
  const toasts = useAnimaList(_toasts, "tail");

  return (
    <AnimaList
      data-position="fixed"
      data-bottom="0"
      data-right="0"
      data-mb="12"
      data-pt="12"
      data-width="100%"
      style={{ maxWidth: "290px" }}
    >
      {toasts.items.map((toast) => (
        <Anima style="opacity" {...toast.props}>
          <li
            key={toast.item.id}
            aria-live="polite"
            data-display="flex"
            data-cross="center"
            data-py="6"
            data-px="12"
            data-mt="12"
            data-fs="14"
            data-color="gray-700"
            data-bg="gray-200"
            data-br="2"
          >
            {toast.item.message}
          </li>
        </Anima>
      ))}
    </AnimaList>
  );
}
