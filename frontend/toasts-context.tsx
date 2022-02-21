import { createContext, h } from "preact";
import { useContext } from "preact/hooks";
import { useList } from "@bgord/frontend";

import { ToastType } from "./types";

type ToastsConfigType = {
  timeout?: number;
};

type UseToastsReturnType = [
  ToastType[],
  {
    add: (toast: Omit<ToastType, "id">) => void;
    remove: (toast: ToastType) => void;
    clear: VoidFunction;
  }
];

function useToastsImplementation(
  config?: ToastsConfigType
): UseToastsReturnType {
  const timeout = config?.timeout ?? 5000;

  const [toasts, actions] = useList<ToastType>({
    comparisonFn: (a, b) => a.id === b.id,
  });

  function add(payload: Omit<ToastType, "id">) {
    const id = String(Date.now());
    const toast = { ...payload, id };

    actions.add(toast);
    setTimeout(() => actions.remove(toast), timeout);
  }

  return [
    [...toasts].reverse(),
    { add, remove: actions.remove, clear: actions.clear },
  ];
}

const ToastsContext = createContext<UseToastsReturnType | undefined>(undefined);

export function ToastsContextProvider(
  props: {
    children: h.JSX.Element | h.JSX.Element[];
  } & ToastsConfigType
) {
  const { children, ...config } = props;

  const [toasts, actions] = useToastsImplementation(config);

  return (
    <ToastsContext.Provider value={[toasts, actions]}>
      {props.children}
    </ToastsContext.Provider>
  );
}

export function useToasts() {
  const context = useContext(ToastsContext);

  if (context === undefined) {
    throw new Error(`useToasts must be used within the ToastsContextProvider`);
  }

  return context;
}

export function useToastTrigger() {
  const [, actions] = useToasts();

  return actions.add;
}
