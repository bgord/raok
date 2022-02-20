import { h, cloneElement } from "preact";
import { useState, useEffect } from "preact/hooks";
import delay from "lodash/delay";

import { usePreviousValue } from "./hooks";

/* eslint-disable no-shadow */
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
    style: { "--duration": `${duration}ms`, ...props.children.props.style },
  });
}

export function getAnimaProps(props: Record<string, unknown>) {
  return {
    "data-anima": props["data-anima"],
    "data-anima-style": props["data-anima-style"],
    style: props.style,
  };
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

export function useAnimaList<T extends { id: string }>(
  list: T[],
  direction: "head" | "tail" = "head"
): {
  items: { item: T; props: { visible: boolean } }[];
  count: number;
} {
  const [officialList, setOfficialList] = useState<
    { item: T; props: { visible: boolean } }[]
  >(list.map((item) => ({ item, props: { visible: true } })));

  const added: T[] = [];

  for (const item of list) {
    const wasAdded = !officialList
      .map((x) => x.item)
      .some((x) => item.id === x.id);

    if (wasAdded) added.push(item);
  }

  useEffect(() => {
    if (added.length === 0) return;

    if (direction === "head") {
      setOfficialList((officialList) => [
        ...added.map((item) => ({ item, props: { visible: true } })),
        ...officialList,
      ]);
    } else {
      setOfficialList((officialList) => [
        ...officialList,
        ...added.map((item) => ({ item, props: { visible: true } })),
      ]);
    }
  }, [added.length, direction]);

  const deleted: T[] = [];

  for (const { item } of officialList) {
    const wasDeleted = list.every((x) => x.id !== item.id);

    if (wasDeleted) deleted.push(item);
  }

  useEffect(() => {
    if (deleted.length === 0) return;

    setOfficialList((officialList) =>
      officialList.map((x) => {
        const wasDeleted = deleted.some((item) => item.id === x.item.id);

        return wasDeleted ? { ...x, props: { visible: false } } : x;
      })
    );
  }, [deleted.length]);

  return {
    items: officialList.map((item) => {
      const updated = list.find((y) => y.id === item.item.id);
      return updated ? { ...item, item: updated } : item;
    }),
    count: officialList.filter((x) => x.props.visible).length,
  };
}
