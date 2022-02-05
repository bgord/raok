import { h } from "preact";

import { AnimaList, Anima, useAnimaList } from "./anima";
import { useNotifications } from "./notifications-context";

export function Notifications() {
  const [_notifications] = useNotifications();

  const notifications = useAnimaList(_notifications, "tail");

  return (
    <AnimaList
      data-position="fixed"
      data-mb="12"
      data-pt="12"
      data-width="100%"
      style={{ bottom: 0, right: 0, maxWidth: "290px" }}
    >
      {notifications.items.map((notification) => (
        <Anima style="opacity" {...notification.props}>
          <li
            key={notification.item.id}
            aria-live="polite"
            data-display="flex"
            data-cross="center"
            data-py="6"
            data-px="12"
            data-mt="12"
            data-fs="14"
            data-color="gray-700"
            data-bg="gray-200"
            data-br="2"
          >
            {notification.item.message}
          </li>
        </Anima>
      ))}
    </AnimaList>
  );
}
