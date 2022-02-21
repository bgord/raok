import { createContext, h, Context } from "preact";
import { useContext } from "preact/hooks";
import { useList } from "@bgord/frontend";

type ToastsConfigType = {
  timeout?: number;
};

export type BaseToastType = {
  id: string;
  message: string;
};

type ToastsContextDataType<ToastType extends BaseToastType = BaseToastType> = [
  ToastType[],
  {
    add: (toast: Omit<ToastType, "id">) => void;
    remove: (toast: ToastType) => void;
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

export function useToasts<ToastType extends BaseToastType = BaseToastType>() {
  const context = useContext<ToastsContextDataType<ToastType>>(
    ToastsContext as unknown as Context<ToastsContextDataType<ToastType>>
  );

  if (context === undefined) {
    throw new Error(`useToasts must be used within the ToastsContextProvider`);
  }

  return context;
}

export function useToastTrigger<
  ToastType extends BaseToastType = BaseToastType
>() {
  const [, actions] = useToasts<ToastType>();

  return actions.add;
}
