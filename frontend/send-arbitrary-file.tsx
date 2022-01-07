import { h } from "preact";

import { Header } from "./ui";

export function SendArbitraryFile() {
  return (
    <form data-mt="24" data-bg="gray-100" data-p="12">
      <Header data-mb="24">Send arbitrary file</Header>
    </form>
  );
}
