import { h } from "preact";
import * as bg from "@bgord/frontend";

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
      style="text-align: center"
      {...props}
    />
  );
}

export function Link(props: h.JSX.IntrinsicElements["a"]) {
  return (
    /* eslint-disable jsx-a11y/anchor-has-content */
    <a
      class="c-link"
      data-color="gray-700"
      data-transform="truncate"
      title={props.href}
      {...props}
    />
  );
}

export function OutboundLink(props: h.JSX.IntrinsicElements["a"]) {
  return <bg.OutboundLink as={Link} {...props} />;
}

export function Header(props: h.JSX.IntrinsicElements["h2"]) {
  /* eslint-disable jsx-a11y/heading-has-content */
  return <h2 data-fs="16" data-color="gray-700" data-fw="500" {...props} />;
}
