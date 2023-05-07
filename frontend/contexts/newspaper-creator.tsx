import * as bg from "@bgord/frontend";
import { h, createContext, VNode } from "preact";
import { useContext } from "preact/hooks";

import { NEWSPAPER_MAX_ARTICLES_NUMBER } from "../../value-objects/newspaper-max-articles-number";

import * as types from "../types";

type NewspaperCreatorState = bg.UseListReturnType<types.ArticleType["id"]>;

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

  const [selectedArticleIds, _actions] = props.state;

  const actions = {
    ..._actions,
    toggle: (payload: types.ArticleType["id"]) => {
      if (selectedArticleIds.length < NEWSPAPER_MAX_ARTICLES_NUMBER) {
        _actions.toggle(payload);
      } else {
        notify({
          message: t("newspaper.too_many_articles", {
            max: NEWSPAPER_MAX_ARTICLES_NUMBER,
          }),
        });
      }
    },
  };

  return (
    <NewspaperCreatorContext.Provider value={[selectedArticleIds, actions]}>
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
