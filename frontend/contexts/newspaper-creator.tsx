import * as bg from "@bgord/frontend";
import { h, createContext, VNode } from "preact";
import { useContext } from "preact/hooks";

import * as types from "../types";

type NewspaperCreatorState = {
  selectedArticleIds: bg.UseListReturnType<types.ArticleType["id"]>[0];
  actions: bg.UseListReturnType<types.ArticleType["id"]>[1];
};

const NewspaperCreatorContext = createContext<
  NewspaperCreatorState | undefined
>(undefined);

type NewspaperCreatorProviderProps = {
  children: VNode;
  state: NewspaperCreatorState;
};

export function NewspaperCreatorProvider(props: NewspaperCreatorProviderProps) {
  const notify = bg.useToastTrigger();
  const t = bg.useTranslations();

  const actions = {
    ...props.state.actions,
    toggle: (payload: types.ArticleType["id"]) => {
      if (
        props.state.selectedArticleIds.length <
        types.NEWSPAPER_MAX_ARTICLES_NUMBER
      ) {
        props.state.actions.toggle(payload);
      } else {
        notify({
          message: t("newspaper.too_many_articles", {
            max: types.NEWSPAPER_MAX_ARTICLES_NUMBER,
          }),
        });
      }
    },
  };

  return (
    <NewspaperCreatorContext.Provider
      value={{ selectedArticleIds: props.state.selectedArticleIds, actions }}
    >
      {props.children}
    </NewspaperCreatorContext.Provider>
  );
}

export function useNewspaperCreator() {
  const context = useContext(NewspaperCreatorContext);

  if (!context) {
    throw new Error(
      "useNewspaperCreator must be used within a NewspaperCreatorProvider"
    );
  }

  return context;
}
