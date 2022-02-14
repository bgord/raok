import { Link } from "preact-router";
import { h } from "preact";

import * as Icons from "./icons";
import { useWindowSize, useToggle } from "./hooks";

export function Navigation() {
  const { width } = useWindowSize();

  if (!width) return <NavigationShell />; // Don't SSR navigation
  if (width <= 768) return <NavigationMobile />;
  return <NavigationDesktop />;
}

function NavigationDesktop() {
  return (
    <nav data-display="flex" data-p="12" data-bg="gray-800">
      <NavigationLogo />

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

function NavigationMobile() {
  const navigation = useToggle();

  return (
    <nav
      data-display="flex"
      data-cross="center"
      data-py="6"
      data-px="12"
      data-bg="gray-800"
    >
      <NavigationLogo />

      <button
        type="button"
        class="c-button"
        data-variant="bare"
        onClick={navigation.toggle}
      >
        <Icons.HamburgerMenu />
      </button>
    </nav>
  );
}

function NavigationShell() {
  return (
    <nav data-p="12" data-bg="gray-800" style={{ height: "48px" }}>
      <NavigationLogo />
    </nav>
  );
}

function NavigationLink(props: h.JSX.HTMLAttributes) {
  return (
    <Link class="c-link" data-color="white" data-variant="bare" {...props} />
  );
}

function NavigationLogo() {
  return (
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
  );
}
