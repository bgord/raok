import { createContext, h } from "preact";
import { useContext } from "preact/hooks";
import { useList } from "./hooks";

type NotificationType = "success" | "error";

type Notification = {
  id: number;
  type: NotificationType;
  message: string;
};

type UseNotificationsReturnType = [
  Notification[],
  {
    add: (notification: Omit<Notification, "id">) => void;
    remove: (notification: Notification) => void;
    clear: VoidFunction;
  }
];

function useNotificationsImplementation(): UseNotificationsReturnType {
  const [notifications, actions] = useList<Notification>(
    [],
    (a, b) => a.id === b.id
  );

  function add(notification: Omit<Notification, "id">) {
    const id = Date.now();

    actions.add({ ...notification, id });

    setTimeout(() => actions.remove({ ...notification, id }), 5000);
  }

  return [
    [...notifications].reverse(),
    { add, remove: actions.remove, clear: actions.clear },
  ];
}

const NotificationsContext = createContext<
  UseNotificationsReturnType | undefined
>(undefined);

export function NotificationsContextProvider({
  children,
}: {
  children: h.JSX.Element | h.JSX.Element[];
}) {
  const [notifications, actions] = useNotificationsImplementation();

  return (
    <NotificationsContext.Provider value={[notifications, actions]}>
      {children}
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
