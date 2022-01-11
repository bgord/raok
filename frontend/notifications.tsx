import { h } from "preact";

import { useNotifications } from "./notifications-context";

export function Notifications() {
  const [notifications] = useNotifications();

  return (
    <ul>
      {notifications.map((notification) => (
        <li>{notification.message}</li>
      ))}
    </ul>
  );
}
