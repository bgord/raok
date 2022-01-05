import { h, render } from "preact";

import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

function App() {
  return <QueryClientProvider client={queryClient}>test</QueryClientProvider>;
}

render(<App />, document.querySelector("#root") ?? document.body);
