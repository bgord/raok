import { h, cloneElement } from "preact";
import { useState, useEffect } from "preact/hooks";
import delay from "lodash/delay";
import difference from "lodash/difference";
import eq from "lodash/eq";
import uniqWith from "lodash/uniqWith";
import isEqual from "lodash/isEqual";

import { usePreviousValue } from "./hooks";

enum AnimaState {
  appearing = "appearing",
  appeared = "appeared",
  hidding = "hidding",
  hidden = "hidden",
}

type AnimaConfigType = {
  children: h.JSX.Element;
  visible: boolean;
  style: string;
  duration?: number;
  isInitial?: boolean;
};

export function Anima(props: AnimaConfigType) {
  const duration = props.duration ?? 300;

  const [state, setState] = useState<AnimaState>(() => {
    if (!props.visible) return AnimaState.hidden;
    if (props.isInitial) return AnimaState.appeared;
    return AnimaState.appearing;
  });
  const previousState = usePreviousValue(state);

  useEffect(() => {
    if (props.isInitial) return;

    if (props.visible) {
      setState(AnimaState.appearing);
      delay(() => setState(AnimaState.appeared), 100);
    } else {
      if (!previousState) return;
      setState(AnimaState.hidding);
      delay(() => setState(AnimaState.hidden), duration);
    }
  }, [props.visible]);

  if (state === AnimaState.hidden) return null;

  return cloneElement(props.children, {
    "data-anima": state,
    "data-anima-style": props.style,
    style: { "--duration": `${duration}ms` },
  });
}

export function AnimaList(
  props: {
    children: h.JSX.Element[];
  } & h.JSX.IntrinsicElements["ul"]
) {
  const { children, ...rest } = props;

  const [isInitial, setIsInitial] = useState<boolean>(true);

  useEffect(() => setIsInitial(false), []);

  return (
    <ul {...rest}>
      {props.children.map((child) => cloneElement(child, { isInitial }))}
    </ul>
  );
}

export function useAnimaList<T>(list: T[]): { item: T; visible: boolean }[] {
  const previousList = usePreviousValue(list);

  const diff = difference(previousList, list);

  if (diff.length === 0) {
    return list.map((item) => ({
      item,
      visible: true,
    }));
  }

  return uniqWith([...list, ...(previousList ?? [])], isEqual).map((item) => {
    const hasChanged = diff.some((x) => eq(x, item));

    if (!hasChanged) {
      return { item, visible: true };
    }

    const wasDeleted = previousList?.some((x) => eq(x, item));

    return { item, visible: wasDeleted ? false : true };
  });
}
