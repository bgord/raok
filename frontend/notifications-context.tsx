import { createContext, h } from "preact";
import { useContext } from "preact/hooks";
import { useList } from "@bgord/frontend";

import { NotificationType } from "./types";

type UseNotificationsReturnType = [
  NotificationType[],
  {
    add: (notification: Omit<NotificationType, "id">) => void;
    remove: (notification: NotificationType) => void;
    clear: VoidFunction;
  }
];

function useNotificationsImplementation(config?: {
  timeout?: number;
}): UseNotificationsReturnType {
  const timeout = config?.timeout ?? 5000;

  const [notifications, actions] = useList<NotificationType>({
    comparisonFn: (a, b) => a.id === b.id,
  });

  function add(payload: Omit<NotificationType, "id">) {
    const id = String(Date.now());
    const notification = { ...payload, id };

    actions.add(notification);
    setTimeout(() => actions.remove(notification), timeout);
  }

  return [
    [...notifications].reverse(),
    { add, remove: actions.remove, clear: actions.clear },
  ];
}

const NotificationsContext = createContext<
  UseNotificationsReturnType | undefined
>(undefined);

export function NotificationsContextProvider(props: {
  children: h.JSX.Element | h.JSX.Element[];
  timeout?: number;
}) {
  const { children, ...config } = props;

  const [notifications, actions] = useNotificationsImplementation(config);

  return (
    <NotificationsContext.Provider value={[notifications, actions]}>
      {props.children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const state = useContext(NotificationsContext);

  if (state === undefined) {
    throw new Error(
      `useNotifications must be used within the NotificationsContextProvider`
    );
  }
  return state;
}

export function useNotificationTrigger() {
  const [, actions] = useNotifications();

  return actions.add;
}
