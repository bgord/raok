import { h } from "preact";

import { useNotifications } from "./notifications-context";

export function Notifications() {
  const [notifications] = useNotifications();

  return (
    <ul
      data-position="fixed"
      data-mb="12"
      data-ml="12"
      data-pt="12"
      data-width="100%"
      style={{ bottom: 0, left: 0, maxWidth: "290px", listStyle: "none" }}
    >
      {notifications.map((notification) => (
        <li
          key={notification.id}
          aria-live="polite"
          data-notification={notification.state}
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
          {notification.message}
        </li>
      ))}
    </ul>
  );
}
