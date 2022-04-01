import { Link } from "preact-router/match";
import { h, Fragment } from "preact";
import * as bg from "@bgord/frontend";

import * as Icons from "./icons";

export function Navigation() {
  const { width } = bg.useWindowDimensions();

  if (!width) return <NavigationShell />; // Don't SSR navigation
  if (width <= 768) return <NavigationMobile />;
  return <NavigationDesktop />;
}

function NavigationDesktop() {
  const t = bg.useTranslations();

  return (
    <nav data-display="flex" data-p="12" data-bg="gray-800">
      <NavigationLogo />

      <NavigationLink href="/review" data-mr="24">
        {t("app.review")}
      </NavigationLink>

      <NavigationLink href="/archive/articles" data-mr="24">
        {t("app.articles")}
      </NavigationLink>

      <NavigationLink href="/archive/newspapers" data-mr="24">
        {t("app.newspapers")}
      </NavigationLink>

      <NavigationLink href="/settings">{t("app.settings")}</NavigationLink>

      <strong data-mx="36" data-color="white">
        admin
      </strong>

      <NavigationLink data-mr="24" href="/logout">
        {t("app.logout")}
      </NavigationLink>
    </nav>
  );
}

function NavigationMobile() {
  const navigation = bg.useToggle();
  const t = bg.useTranslations();

  bg.useScrollLock(navigation.on);

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

      <bg.Anima visible={navigation.on} effect="opacity">
        <nav
          data-display="flex"
          data-direction="column"
          data-wrap="nowrap"
          data-overflow="auto"
          data-position="fixed"
          data-inset="0"
          data-z="1"
          data-bg="gray-800"
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
            data-my="24"
          >
            <NavigationLink
              onClick={navigation.disable}
              href="/review"
              data-mb="24"
            >
              {t("app.review")}
            </NavigationLink>

            <NavigationLink
              onClick={navigation.disable}
              href="/archive/articles"
              data-mb="24"
            >
              {t("app.articles")}
            </NavigationLink>

            <NavigationLink
              onClick={navigation.disable}
              href="/archive/newspapers"
              data-mb="24"
            >
              {t("app.newspapers")}
            </NavigationLink>
            <NavigationLink
              onClick={navigation.disable}
              href="/settings"
              data-mb="24"
            >
              {t("app.settings")}
            </NavigationLink>
            <strong data-color="white" data-mb="24">
              admin
            </strong>
            <NavigationLink onClick={navigation.disable} href="/logout">
              {t("app.logout")}
            </NavigationLink>
          </div>
        </nav>
      </bg.Anima>
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
      data-transform="capitalize"
      data-color="white"
      data-variant="bare"
      {...props}
    />
  );
}

function NavigationLogo(props: h.JSX.HTMLAttributes) {
  const t = bg.useTranslations();

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
      {t("app.name")}
    </NavigationLink>
  );
}
