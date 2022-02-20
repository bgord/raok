import { Link } from "preact-router/match";
import { h, Fragment } from "preact";
import { useToggle } from "@bgord/frontend";

import * as Icons from "./icons";
import { useWindowSize, useScrollLock } from "./hooks";
import { Anima } from "./anima";

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

  useScrollLock(navigation.on);

  return (
    <Fragment>
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
          onClick={navigation.enable}
        >
          <Icons.HamburgerMenu />
        </button>
      </nav>

      <Anima visible={navigation.on} style="opacity">
        <nav
          data-display="flex"
          data-direction="column"
          data-bg="gray-800"
          data-position="fixed"
          data-inset="0"
          data-z="1"
        >
          <div data-display="flex" data-cross="center" data-py="6" data-px="12">
            <NavigationLogo onClick={navigation.disable} />

            <button
              type="button"
              class="c-button"
              data-variant="bare"
              onClick={navigation.disable}
            >
              <Icons.Close data-color="white" height="30" width="30" />
            </button>
          </div>

          <div
            data-display="flex"
            data-direction="column"
            data-cross="center"
            data-mt="48"
          >
            <NavigationLink
              onClick={navigation.disable}
              href="/archive/articles"
              data-mb="24"
            >
              Articles
            </NavigationLink>
            <NavigationLink
              onClick={navigation.disable}
              href="/archive/newspapers"
              data-mb="24"
            >
              Newspapers
            </NavigationLink>
            <NavigationLink
              onClick={navigation.disable}
              href="/settings"
              data-mb="24"
            >
              Settings
            </NavigationLink>
            <strong data-color="white" data-mb="24">
              admin
            </strong>
            <NavigationLink onClick={navigation.disable} href="/logout">
              Logout
            </NavigationLink>
          </div>
        </nav>
      </Anima>
    </Fragment>
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
    <Link
      activeClassName="c-link--active"
      class="c-link"
      data-color="white"
      data-variant="bare"
      {...props}
    />
  );
}

function NavigationLogo(props: h.JSX.HTMLAttributes) {
  return (
    <NavigationLink
      href="/dashboard"
      data-fs="20"
      data-ls="2"
      data-color="gray-100"
      data-fw="500"
      data-mr="auto"
      {...props}
    >
      RAOK
    </NavigationLink>
  );
}
