import { h } from "preact";

export function HamburgerMenu(props: h.JSX.IntrinsicElements["svg"]) {
  return (
    <svg
      width="24"
      height="24"
      stroke-width="1.5"
      viewBox="0 0 24 24"
      data-color="white"
      {...props}
    >
      <path
        d="M3 5H21"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M3 12H21"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M3 19H21"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
