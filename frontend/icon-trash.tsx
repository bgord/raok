import { h } from "preact";

export function Trash(props: h.JSX.IntrinsicElements["svg"]) {
  return (
    <svg viewBox="0 0 70 70" height="30" width="30" {...props}>
      <path d="M46,29v25H24V29H46 M50,25H20v33h30V25L50,25z" />
      <path d="M39,19v-3h-8v3H18v4h34v-4H39z" />
    </svg>
  );
}
