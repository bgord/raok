import { h } from "preact";
import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";

export function Badge(props: h.JSX.IntrinsicElements["strong"]) {
  return (
    <strong
      data-transform="uppercase center"
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

export function Select(props: h.JSX.IntrinsicElements["select"]) {
  return (
    <div class="c-select-wrapper">
      <select class="c-select" {...props} />
    </div>
  );
}

type CopyButtonPropsType = h.JSX.IntrinsicElements["button"] & {
  options: bg.CopyToClipboardOptionsType;
};

export function CopyButton(props: CopyButtonPropsType) {
  const { options, ...rest } = props;

  return (
    <button
      type="button"
      class="c-button"
      data-variant="bare"
      title="Copy link"
      onClick={() => bg.copyToClipboard(options)}
      {...rest}
    >
      <Icons.Copy width="24" height="24" />
    </button>
  );
}

export function ClearButton(props: h.JSX.IntrinsicElements["button"]) {
  return (
    <button
      title="Clear query"
      type="button"
      class="c-button"
      data-variant="bare"
      data-display="flex"
      data-main="center"
      data-cross="center"
      {...props}
    >
      <Icons.Cancel width="24" height="24" />
    </button>
  );
}
