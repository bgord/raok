import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";
import { h, Fragment } from "preact";
import { useQuery } from "react-query";

import * as types from "./types";
import * as api from "./api";
import * as UI from "./ui";

export function SourcePreview(
  props: Pick<types.SourceType, "id"> & h.JSX.IntrinsicElements["button"]
) {
  const { id, ...rest } = props;

  const t = bg.useTranslations();
  const dialog = bg.useToggle();

  const preview = useQuery(
    api.keys.sourcePreview(id),
    () => api.Source.preview(id),
    { enabled: dialog.on }
  );

  return (
    <>
      <button
        type="button"
        onClick={dialog.enable}
        class="c-button"
        data-variant="bare"
        data-cross="center"
        title={t("source.preview")}
        {...rest}
        {...dialog.props.controller}
      >
        <Icons.Eye />
      </button>

      <bg.Dialog
        {...dialog}
        {...dialog.props.target}
        data-wrap="nowrap"
        data-gap="12"
        data-mt="48"
        data-max-width="768"
        data-width="100%"
        data-p="24"
        data-md-p="6"
        {...bg.Rhythm().times(50).style.height}
      >
        <div data-display="flex" data-main="between" data-cross="center">
          <div data-fw="700">{t("source.preview")}</div>

          <button
            type="button"
            class="c-button"
            data-variant="with-icon"
            title={t("app.close")}
            onClick={bg.exec([dialog.disable, preview.remove])}
          >
            <Icons.Xmark width="20" height="20" />
          </button>
        </div>

        {preview.isLoading && (
          <div data-fs="14" data-color="gray-600">
            {t("app.loading")}
          </div>
        )}

        {preview.isError && (
          <div data-fs="14" data-color="gray-600">
            {t("source.preview.error")}
          </div>
        )}

        <ul
          data-display="flex"
          data-direction="column"
          data-wrap="nowrap"
          data-md-gap="6"
          data-height="100%"
          data-overflow="scroll"
          {...bg.Rhythm().times(40).style.maxHeight}
        >
          {(preview.data ?? []).map((item) => (
            <li
              data-display="flex"
              data-wrap="nowrap"
              data-md-wrap="wrap"
              data-main="between"
              data-gap="3"
              data-md-gap="0"
              key={item.url}
            >
              <UI.ArticleUrl data-fs="14" url={item.url}>{item.url}</UI.ArticleUrl>

              <UI.Info
                data-color="gray-400"
                data-ml="auto"
                data-mt="3"
                data-md-mt="0"
                data-mb="auto"
                data-transform="nowrap"
                title={bg.DateFormatter.datetime(item.createdAt.raw)}
              >
                {item.createdAt.relative}
              </UI.Info>
            </li>
          ))}
        </ul>
      </bg.Dialog>
    </>
  );
}
