import { createContext, h } from "preact";
import { useContext } from "preact/hooks";
import { useList } from "@bgord/frontend";

type ToastsConfigType = {
  timeout?: number;
};

export type BaseToastType = {
  id: string;
  type: string;
  message: string;
};

type ToastsContextDataType = [
  BaseToastType[],
  {
    add: (toast: Omit<BaseToastType, "id">) => void;
    remove: (toast: BaseToastType) => void;
    clear: VoidFunction;
  }
];

const ToastsContext = createContext<ToastsContextDataType | undefined>(
  undefined
);

export function ToastsContextProvider(
  props: {
    children: h.JSX.Element | h.JSX.Element[];
  } & ToastsConfigType
) {
  function useToastsImplementation(): ToastsContextDataType {
    const timeout = props?.timeout ?? 5000;

    const [toasts, actions] = useList<BaseToastType>({
      comparisonFn: (a, b) => a.id === b.id,
    });

    function add(payload: Omit<BaseToastType, "id">) {
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

  const [toasts, actions] = useToastsImplementation();

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
