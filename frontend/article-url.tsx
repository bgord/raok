import { h } from "preact";
import { useMutation } from "react-query";

import * as api from "./api";
import * as UI from "./ui";
import * as types from "./types";

type ArticlePropsType = types.ArticleType;

export function ArticleUrl(props: ArticlePropsType) {
  const articleOpened = useMutation(api.Article.opened);

  return (
    <UI.ArticleUrl
      url={props.url}
      onClick={() => articleOpened.mutate(props.id)}
    />
  );
}
