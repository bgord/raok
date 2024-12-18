import { Link } from "preact-router/match";
import { h, Fragment } from "preact";
import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";

import * as types from "./types";

type NavigationPropsType = { email: types.EmailType };

export function Navigation(props: NavigationPropsType) {
  const { width } = bg.useWindowDimensions();

  if (!width) return <NavigationShell />; // Don't SSR navigation
  if (width <= 768) return <NavigationMobile {...props} />;
  return <NavigationDesktop {...props} />;
}

function NavigationDesktop(props: NavigationPropsType) {
  const t = bg.useTranslations();

  return (
    <nav data-display="flex" data-main="between" data-p="12" data-bg="gray-800">
      <NavigationLogo />

      <OfflineIndicator />

      <div data-display="flex" data-gap="12">
        <NavigationLink href="/archive/articles">
          {t("app.articles")}
        </NavigationLink>
        <NavigationLink href="/sources">{t("app.sources")}</NavigationLink>
        <NavigationLink href="/settings">{t("app.settings")}</NavigationLink>
        <strong data-mx="6" data-color="white">
          {props.email}
        </strong>
        <NavigationLink href="/logout">{t("app.logout")}</NavigationLink>
      </div>
    </nav>
  );
}

function NavigationMobile(props: NavigationPropsType) {
  const navigation = bg.useToggle();
  const t = bg.useTranslations();

  bg.useScrollLock(navigation.on);

  return (
    <Fragment>
      <nav
        data-display="flex"
        data-main="between"
        data-cross="center"
        data-py="6"
        data-px="12"
        data-bg="gray-800"
      >
        <NavigationLogo />

        <OfflineIndicator data-fs="14" />

        <button
          type="button"
          class="c-button"
          data-variant="bare"
          title={t("app.menu.show")}
          onClick={navigation.enable}
          {...navigation.props.controller}
        >
          <Icons.Menu data-color="white" height="24" width="24" />
        </button>
      </nav>

      {navigation.on && (
        <nav
          data-display="flex"
          data-direction="column"
          data-wrap="nowrap"
          data-overflow="auto"
          data-position="fixed"
          data-inset="0"
          data-z="1"
          data-bg="gray-800"
          {...navigation.props.target}
        >
          <div
            data-display="flex"
            data-main="between"
            data-cross="center"
            data-py="6"
            data-px="12"
          >
            <NavigationLogo onClick={navigation.disable} />

            <button
              type="button"
              class="c-button"
              data-variant="bare"
              onClick={navigation.disable}
              title={t("app.menu.close")}
            >
              <Icons.Xmark data-color="white" height="30" width="30" />
            </button>
          </div>

          <div
            data-display="flex"
            data-direction="column"
            data-cross="center"
            data-gap="24"
            data-my="24"
          >
            <NavigationLink
              onClick={navigation.disable}
              href="/archive/articles"
            >
              {t("app.articles")}
            </NavigationLink>

            <NavigationLink onClick={navigation.disable} href="/sources">
              {t("app.sources")}
            </NavigationLink>

            <NavigationLink onClick={navigation.disable} href="/settings">
              {t("app.settings")}
            </NavigationLink>

            <strong data-color="white">{props.email}</strong>
            <NavigationLink onClick={navigation.disable} href="/logout">
              {t("app.logout")}
            </NavigationLink>
          </div>
        </nav>
      )}
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

function NavigationLink(props: Omit<h.JSX.HTMLAttributes, "ref">) {
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
      data-transform="uppercase"
      {...props}
    >
      {t("app.name")}
    </NavigationLink>
  );
}

function OfflineIndicator(props: h.JSX.IntrinsicElements["div"]) {
  const t = bg.useTranslations();

  return (
    <bg.OfflineIndicator>
      <div
        class="c-link"
        data-transform="upper-first,center"
        data-color="white"
        data-variant="bare"
        data-mx="auto"
        {...props}
      >
        {t("app.no_internet_connection")}
      </div>
    </bg.OfflineIndicator>
  );
}
