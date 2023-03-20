import { h } from "preact";
import * as bg from "@bgord/frontend";
import * as Icons from "iconoir-react";

import * as UI from "./ui";

export function ArticlesSearchForm() {
  const search = bg.useClientSearch();

  return (
    <form
      data-display="flex"
      data-wrap="nowrap"
      data-max-width="100%"
      data-gap="6"
      data-mb="48"
      onSubmit={(event) => {
        event.preventDefault();
        console.log({ query: search.query });
      }}
    >
      <div data-position="relative" data-width="100%">
        <input
          list="articles"
          class="c-input"
          placeholder="Search for an article..."
          style="padding-right: 36px"
          data-width="100%"
          pattern=".{3,512}"
          onChange={search.onChange}
          value={search.query}
        />
        <Icons.Search
          height="34"
          width="34"
          data-position="absolute"
          data-p="6"
          style="top: 1px; right: 1px; background: white;"
        />
      </div>

      <UI.ClearButton />
    </form>
  );
}
