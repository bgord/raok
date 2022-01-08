import { h } from "preact";

export function Badge(props: h.JSX.IntrinsicElements["strong"]) {
  return (
    <strong
      data-transform="uppercase"
      data-color="gray-600"
      data-bg="gray-200"
      data-px="6"
      data-br="4"
      data-ls="1"
      data-fs="12"
      {...props}
    />
  );
}

export function Link(props: h.JSX.IntrinsicElements["a"]) {
  return (
    <a
      target="_blank"
      class="c-link"
      data-color="gray-700"
      data-overflow="hidden"
      style={{ whiteSpace: "nowrap", textOverflow: "ellipsis" }}
      {...props}
    />
  );
}

export function Header(props: h.JSX.IntrinsicElements["h2"]) {
  return <h2 data-fs="16" data-color="gray-800" data-fw="500" {...props} />;
}
