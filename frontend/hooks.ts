import { h } from "preact";
import { useState, useEffect, StateUpdater } from "preact/hooks";

export type UseListActionsType<T> = {
  clear: VoidFunction;
  add: (x: T | T[]) => void;
  remove: (x: T) => void;
  toggle: (x: T) => void;
  isAdded: (x: T) => boolean;
  update: StateUpdater<T[]>;
};

export type UseListReturnType<T> = [T[], UseListActionsType<T>];

export function useList<T>(
  defaultItems: T[] = [],
  comparisonFn: (a: T, b: T) => boolean = (a, b) => a === b
): UseListReturnType<T> {
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
    setItems((items) => items.filter((x) => !comparisonFn(x, item)));
  }

  function isAdded(item: T) {
    return items.some((x) => comparisonFn(x, item));
  }

  function toggle(item: T) {
    isAdded(item) ? remove(item) : add(item);
  }

  return [items, { clear, add, remove, toggle, isAdded, update: setItems }];
}

export function useToggle(defaultValue = false) {
  const [on, setIsOn] = useState(defaultValue);

  const enable = () => setIsOn(true);
  const disable = () => setIsOn(false);
  const toggle = () => setIsOn((v) => !v);

  return { on, off: !on, enable, disable, toggle };
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

    if (!files || !files[0]) return;

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

export function useExpandableList(config: { max: number; length: number }) {
  const numberOfExcessiveElements = config.length - config.max;
  const areThereExcessiveElements = config.length > config.max;

  function getState() {
    return areThereExcessiveElements ? "contracted" : "expanded";
  }

  const [state, setState] = useState<"contracted" | "expanded">(getState);

  useEffect(() => setState(getState()), [config.length, config.max]);

  function showMore() {
    if (state === "contracted") {
      setState("expanded");
    }
  }

  function showLess() {
    if (state === "expanded") {
      setState("contracted");
    }
  }

  function filterFn(_element: any, index: number) {
    if (state === "expanded") return true;
    return index < config.max;
  }

  return {
    state,
    displayShowMore: state === "contracted",
    displayShowLess: state === "expanded" && areThereExcessiveElements,
    showMore,
    showLess,
    numberOfExcessiveElements,
    filterFn,
  };
}

export function useSearch(): {
  query: string;
  clear: VoidFunction;
  onChange: (event: h.JSX.TargetedEvent<HTMLInputElement, Event>) => void;
  filterFn: (value: string) => boolean;
} {
  const defaultQuery = "";

  const [query, setValue] = useState<string>(defaultQuery);

  function clear() {
    setValue(defaultQuery);
  }

  function onChange(event: h.JSX.TargetedEvent<HTMLInputElement, Event>) {
    setValue(event.currentTarget.value);
  }

  function filterFn(value: string) {
    if (query === "") return true;

    return value?.toLowerCase().includes(query.toLowerCase());
  }

  return { query, clear, onChange, filterFn };
}

type UseFilterValueType = string;

export function useFilter<T = string>(config: {
  enum: { [key: string]: UseFilterValueType };
  defaultValue?: UseFilterValueType;
  filterFn?: (value: T) => boolean;
}) {
  const defaultValue = config.defaultValue ?? "all";

  const [query, setValue] = useState<UseFilterValueType>(defaultValue);

  function clear() {
    setValue(defaultValue);
  }

  function onChange(event: h.JSX.TargetedEvent<HTMLSelectElement, Event>) {
    const { value } = event.currentTarget;

    if (value !== "all" && !Boolean(config.enum[String(value)])) return;
    else setValue(value);
  }

  function filterFn(value: T) {
    if (query === "all") return true;

    return query === String(value);
  }

  const options = Object.keys(config.enum);

  return {
    query,
    clear,
    onChange,
    filterFn: config.filterFn ?? filterFn,
    options,
  };
}

enum TimestampFiltersEnum {
  today = "today",
  last_3_days = "last_3_days",
  last_week = "last_week",
  last_30_days = "last_30_days",
}
export function useTimestampFilter(config?: {
  defaultValue: Parameters<typeof useFilter>[0]["defaultValue"];
}) {
  const timestamp = useFilter<number | null | undefined>({
    enum: TimestampFiltersEnum,
    defaultValue: config?.defaultValue ?? "all",
    filterFn: (value) => {
      if (timestamp.query === "all") return true;

      if (!value) return false;

      const timeSinceSent = Date.now() - value;

      const DAY = 24 * 60 * 60 * 1000;
      if (timestamp.query === "today") return timeSinceSent <= DAY;

      const THREE_DAYS = 3 * DAY;
      if (timestamp.query === "last_3_days") return timeSinceSent <= THREE_DAYS;

      const WEEK = 7 * DAY;
      if (timestamp.query === "last_week") return timeSinceSent <= WEEK;

      const THIRTY_DAYS = 30 * DAY;
      if (timestamp.query === "last_30_days")
        return timeSinceSent <= THIRTY_DAYS;

      return false;
    },
  });

  return timestamp;
}
