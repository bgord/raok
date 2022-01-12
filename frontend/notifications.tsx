import { h } from "preact";

import { useNotifications } from "./notifications-context";

export function Notifications() {
  const [notifications, actions] = useNotifications();

  return (
    <ul
      data-position="fixed"
      data-mt="72"
      data-ml="12"
      data-pt="12"
      data-width="100%"
      style={{ top: 0, left: 0, maxWidth: "290px", listStyle: "none" }}
    >
      {notifications.map((notification) => (
        <li
          data-notification={notification.state}
          data-display="flex"
          data-cross="center"
          data-pl="12"
          data-px="0"
          data-mt="12"
          data-fs="14"
          data-color="gray-700"
          data-bg="gray-200"
          data-br="2"
        >
          {notification.message}

          <button
            class="c-button"
            data-variant="bare"
            data-ml="auto"
            onClick={() => actions.remove(notification)}
          >
            <img src="/icon-close.svg" alt="" loading="eager" />
          </button>
        </li>
      ))}
    </ul>
  );
}
