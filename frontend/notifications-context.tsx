import { createContext, h } from "preact";
import { useContext } from "preact/hooks";
import { useList } from "./hooks";

type NotificationType = "success" | "error";

type NotificationState = "appearing" | "visible" | "hidding" | "hidden";

type Notification = {
  id: number;
  type: NotificationType;
  state: NotificationState;
  message: string;
};

type UseNotificationsReturnType = [
  Notification[],
  {
    add: (notification: Omit<Notification, "id" | "state">) => void;
    remove: (notification: Notification) => void;
    clear: VoidFunction;
  }
];

function useNotificationsImplementation(): UseNotificationsReturnType {
  const [notifications, actions] = useList<Notification>(
    [],
    (a, b) => a.id === b.id
  );

  function add(notification: Omit<Notification, "id" | "state">) {
    const id = Date.now();

    actions.add({ ...notification, id, state: "appearing" });

    setTimeout(
      () =>
        actions.update((items) =>
          items.map((item) =>
            item.id === id ? { ...item, state: "visible" } : item
          )
        ),
      300
    );

    scheduleRemoval({ ...notification, id });
  }

  function scheduleRemoval(notification: Omit<Notification, "state">) {
    console.log("scheduling removal");

    setTimeout(
      () =>
        actions.update((items) =>
          items.map((item) =>
            item.id === notification.id ? { ...item, state: "hidding" } : item
          )
        ),
      5000
    );

    setTimeout(
      () =>
        actions.remove({
          ...notification,
          id: notification.id,
          state: "hidden",
        }),
      5300
    );
  }

  return [
    [...notifications].reverse(),
    { add, remove: scheduleRemoval, clear: actions.clear },
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
