import { useIsFetching } from "react-query";
import * as bg from "@bgord/frontend";

export function useLeavingPrompt() {
  const numberOfRequestsInProgress = useIsFetching();
  bg.useLeavingPrompt(numberOfRequestsInProgress > 0);
}
