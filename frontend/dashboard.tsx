import { RoutableProps } from "preact-router";
import { h } from "preact";
import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";

import * as hooks from "./hooks";
import * as contexts from "./contexts";

import { ArticleList } from "./article-list";
import { NewspaperList } from "./newspaper-list";
import { Stats } from "./stats";
import { SendArbitraryFile } from "./send-arbitrary-file";
import { CreateNewspaper } from "./create-newspaper";

import * as types from "./types";

export type InitialDashboardDataType = {
  stats: types.StatsType;
  articles: bg.Paged<types.ArticleType>;
  newspapers: types.NewspaperType[];
  devices: types.DeviceType[];
};

export function Dashboard(_: RoutableProps) {
  hooks.useLeavingPrompt();

  const t = bg.useTranslations();
  const scroll = bg.useScroll();

  const displayNonEssentialPanes = scroll.position.value <= 150;

  const [selectedArticleIds, actions] = bg.useList<types.ArticleType["id"]>();

  const sidebar = bg.usePersistentToggle("sidebar-visible", true);

  return (
    <contexts.NewspaperCreatorProvider state={{ selectedArticleIds, actions }}>
      <main
        data-display="flex"
        data-main="center"
        data-mx="auto"
        data-my="12"
        data-md-mb="72"
        data-max-width="1296"
      >
        <button
          type="button"
          class="c-button"
          data-variant="with-icon"
          data-position="absolute"
          data-left="0"
          data-z="2"
          data-mt="6"
          data-ml="6"
          data-md-ml="3"
          title={sidebar.on ? t("sidebar.collapse") : t("sidebar.expand")}
          style={{
            top: bg.Rhythm().times(4).px,
            ...bg.Rhythm().times(2.5).square,
          }}
          onClick={sidebar.toggle}
        >
          {sidebar.on && <Icons.SidebarCollapse height="24" width="24" />}
          {sidebar.off && <Icons.SidebarExpand height="24" width="24" />}
        </button>

        <section
          data-width="100%"
          data-mt="6"
          data-md-mt="24"
          data-mb="24"
          data-pr="24"
          data-md-px="0"
          {...bg.Rhythm().times(62).style.maxWidth}
        >
          <ArticleList />
          <NewspaperList />
        </section>

        {sidebar.on && (
          <section
            data-grow="1"
            data-mt="6"
            data-px="24"
            data-md-px="0"
            data-width="100%"
            data-md-max-width="unset"
            {...bg.Rhythm().times(40).style.maxWidth}
          >
            <CreateNewspaper />
            <SendArbitraryFile />
            {displayNonEssentialPanes && <Stats />}
          </section>
        )}
      </main>
    </contexts.NewspaperCreatorProvider>
  );
}
