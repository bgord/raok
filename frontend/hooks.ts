import { useState } from "preact/hooks";

export function useList<T>(defaultItems: T[] = []): [
  T[],
  {
    clear: VoidFunction;
    add: (x: T | T[]) => void;
    remove: (x: T) => void;
    toggle: (x: T) => void;
    isAdded: (x: T) => boolean;
  }
] {
  const [items, setItems] = useState<T[]>(defaultItems);

  function clear() {
    setItems([]);
  }

  function add(payload: T | T[]) {
    setItems((items) => {
      if (Array.isArray(payload)) {
        return [...items, ...payload];
      }
      return [...items, payload];
    });
  }

  function remove(item: T) {
    setItems((items) => items.filter((x) => x === item));
  }

  function isAdded(item: T) {
    return items.some((x) => x === item);
  }

  function toggle(item: T) {
    isAdded(item) ? remove(item) : add(item);
  }

  return [items, { clear, add, remove, toggle, isAdded }];
}

export function useToggle(defaultValue = false) {
  const [on, setIsOn] = useState(defaultValue);

  const setOn = () => setIsOn(true);
  const setOff = () => setIsOn(false);
  const toggle = () => setIsOn((v) => !v);

  return { on, off: !on, setOn, setOff, toggle };
}
