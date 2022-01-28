import { h, cloneElement } from "preact";
import { useState, useEffect, useRef } from "preact/hooks";
import delay from "lodash/delay";

enum AnimeState {
  appearing = "appearing",
  appeared = "appeared",
  hidding = "hidding",
  hidden = "hidden",
}

type AnimeConfigType = {
  duration?: number;
  children: h.JSX.Element;
  visible: boolean;
  style: string;
};

export function Anime(props: AnimeConfigType) {
  const duration = props.duration ?? 300;

  const [state, setState] = useState<AnimeState>(
    props.visible ? AnimeState.appearing : AnimeState.hidden
  );
  const previousState = usePrevious(state);

  useEffect(() => {
    if (
      !previousState ||
      [AnimeState.hidding, AnimeState.appearing].includes(state)
    ) {
      return;
    }

    if (props.visible) {
      setState(AnimeState.appearing);
      delay(() => setState(AnimeState.appeared), 100);
    } else {
      setState(AnimeState.hidding);
      delay(() => setState(AnimeState.hidden), duration);
    }
  }, [props.visible]);

  if (state === AnimeState.hidden) return null;

  return cloneElement(props.children, {
    "data-anime": state,
    "data-anime-style": props.style,
    style: { "--duration": `${duration}ms` },
  });
}

function usePrevious<T>(value: T) {
  const previousValue = useRef<T | null>(null);

  useEffect(() => {
    previousValue.current = value;
  });

  return previousValue.current;
}
