import { h, Fragment } from "preact";
import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";

import * as types from "./types";

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

function Link(props: h.JSX.IntrinsicElements["a"]) {
  return (
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
  const t = bg.useTranslations();
  const { options, ...rest } = props;

  return (
    <button
      type="button"
      class="c-button"
      data-variant="bare"
      title={t("link.copy")}
      onClick={() => bg.copyToClipboard(options)}
      {...rest}
    >
      <Icons.Copy width="24" height="24" />
    </button>
  );
}

export function ClearButton(props: h.JSX.IntrinsicElements["button"]) {
  const t = bg.useTranslations();

  return (
    <button
      title={t("app.clear_query")}
      type="button"
      class="c-button"
      data-variant="bare"
      data-display="flex"
      data-main="center"
      data-cross="center"
      {...props}
    >
      <Icons.Xmark width="24" height="24" />
    </button>
  );
}

export function Info(props: h.JSX.IntrinsicElements["div"]) {
  return (
    <div
      data-display="flex"
      data-cross="center"
      data-fs="12"
      data-color="gray-600"
      {...props}
    />
  );
}

export function ArticleTitle(props: h.JSX.IntrinsicElements["div"]) {
  return (
    <div data-fs="14" data-transform="truncate" data-width="100%" {...props}>
      {props.title}
    </div>
  );
}

export function ArticleUrl(
  props: h.JSX.IntrinsicElements["a"] & { url: types.ArticleType["url"] }
) {
  const { url, ...rest } = props;

  return (
    <OutboundLink href={props.url} data-max-width="100%" data-fs="12" {...rest}>
      {props.url}
    </OutboundLink>
  );
}

export function Switch(
  props: bg.UseFieldReturnType<boolean> &
    Omit<h.JSX.IntrinsicElements["input"], "label" | "value">
) {
  const { value, set, input, label, ...rest } = props;

  return (
    <Fragment>
      <input
        class="c-switch-checkbox"
        type="checkbox"
        checked={value}
        onChange={(event) => set(event.currentTarget.checked)}
        {...input.props}
        {...rest}
      />

      <label class="c-switch-label" {...label.props}>
        <div class="c-switch-slider"></div>
      </label>
    </Fragment>
  );
}
