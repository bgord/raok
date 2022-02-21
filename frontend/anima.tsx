import { h, cloneElement } from "preact";
import { useState, useEffect } from "preact/hooks";

export function getAnimaProps(props: Record<string, any>) {
  return {
    "data-anima": props["data-anima"],
    "data-anima-effect": props["data-anima-effect"],
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
