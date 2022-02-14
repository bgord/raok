import { Link } from "preact-router";
import { h } from "preact";

export function Navigation() {
  return <NavigationDesktop />;
}

function NavigationDesktop() {
  return (
    <nav data-display="flex" data-p="12" data-md-px="12" data-bg="gray-800">
      <NavigationLink
        href="/dashboard"
        data-fs="20"
        data-ls="2"
        data-color="gray-100"
        data-fw="500"
        data-mr="auto"
      >
        RAOK
      </NavigationLink>

      <NavigationLink href="/archive/articles" data-mr="24">
        Articles
      </NavigationLink>

      <NavigationLink href="/archive/newspapers" data-mr="24">
        Newspapers
      </NavigationLink>

      <NavigationLink href="/settings">Settings</NavigationLink>

      <strong data-mx="36" data-color="white">
        admin
      </strong>

      <NavigationLink data-mr="24" href="/logout">
        Logout
      </NavigationLink>
    </nav>
  );
}

function NavigationLink(props: h.JSX.HTMLAttributes) {
  return (
    <Link class="c-link" data-color="white" data-variant="bare" {...props} />
  );
}
