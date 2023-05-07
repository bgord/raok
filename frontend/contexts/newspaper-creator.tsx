import * as bg from "@bgord/frontend";
import { h, createContext, VNode } from "preact";
import { useContext } from "preact/hooks";

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
  return (
    <NewspaperCreatorContext.Provider value={props.state}>
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
