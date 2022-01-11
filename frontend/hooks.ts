import { h } from "preact";
import { useState, useEffect } from "preact/hooks";

export type UseListActionsType<T> = {
  clear: VoidFunction;
  add: (x: T | T[]) => void;
  remove: (x: T) => void;
  toggle: (x: T) => void;
  isAdded: (x: T) => boolean;
};

export function useList<T>(
  defaultItems: T[] = []
): [T[], UseListActionsType<T>] {
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
    setItems((items) => items.filter((x) => x !== item));
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

export enum UseFileState {
  "idle" = "idle",
  "selected" = "selected",
}
type UseFileIdle = {
  state: UseFileState.idle;
  data: null;
  actions: {
    selectFile(event: h.JSX.TargetedEvent<HTMLInputElement, Event>): void;
    clearFile: VoidFunction;
  };
};
type UseFileSelected = {
  state: UseFileState.selected;
  data: File;
  actions: {
    selectFile(event: h.JSX.TargetedEvent<HTMLInputElement, Event>): void;
    clearFile: VoidFunction;
  };
};
export function useFile(): UseFileIdle | UseFileSelected {
  const [state, setState] = useState<UseFileState>(UseFileState.idle);
  const [file, setFile] = useState<File | null>(null);

  function selectFile(event: h.JSX.TargetedEvent<HTMLInputElement, Event>) {
    const files = event.currentTarget.files;

    if (!files) return;

    setFile(files[0]);
    setState(UseFileState.selected);
  }

  function clearFile() {
    setFile(null);
    setState(UseFileState.idle);
  }

  const actions = { selectFile, clearFile };

  if (state === UseFileState.idle) {
    return { state, data: null, actions };
  }

  return { state, data: file as File, actions };
}

export enum AnimatedToggleState {
  appearing = "appearing",
  appeared = "appeared",
  hidding = "hidding",
  hidden = "hidden",
}

const defaultConfig = { default: AnimatedToggleState.hidden, delay: 220 };

export function useAnimatiedToggle(
  config: { default: AnimatedToggleState; delay: number } = defaultConfig
) {
  const [state, setState] = useState<AnimatedToggleState>(config.default);

  function show() {
    setState(AnimatedToggleState.appearing);
  }

  function hide() {
    setState(AnimatedToggleState.hidding);
  }

  function toggle() {
    if (state === AnimatedToggleState.appeared) hide();
    else show();
  }

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> =
      null as unknown as ReturnType<typeof setTimeout>;

    if (state === AnimatedToggleState.hidding) {
      timeoutId = setTimeout(
        () => setState(AnimatedToggleState.hidden),
        config.delay
      );
    }

    if (state === AnimatedToggleState.appearing) {
      timeoutId = setTimeout(() => setState(AnimatedToggleState.appeared), 0);
    }

    return () => clearTimeout(timeoutId);
  }, [state]);

  return {
    state,
    actions: { show, hide, toggle },
    props: { "data-toggle": state },
  };
}
