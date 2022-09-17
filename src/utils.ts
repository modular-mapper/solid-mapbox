/** Prepends a type segment to a type. */
export type Prefix<T extends string, V extends string> = T extends "" ? "" : `${V}${T}`;

/** Prepends a type segment to each key in an object type. */
export type MappedEventHandlers<T extends Record<string, unknown>> = {
  [K in keyof T as K extends string ? `on${K}` : never]: (event: T[K]) => void;
};

/** Flattens */
export type NestedKeys<T> = (
  T extends object
    ? { [K in Exclude<keyof T, symbol>]: `${K}${Prefix<NestedKeys<T[K]>, ":">}` }[Exclude<keyof T, symbol>]
    : ""
) extends infer D
  ? Extract<D, string>
  : never;

export type Cursor =
  | "alias"
  | "all-scroll"
  | "auto"
  | "default"
  | "help"
  | "pointer"
  | "wait"
  | "text"
  | "move"
  | "not-allowed"
  | "grab"
  | "grabbing"
  | "zoom-in"
  | "zoom-out"
  | "col-resize"
  | "row-resize"
  | "n-resize"
  | "e-resize"
  | "s-resize"
  | "w-resize";

/** Returns an array of key-value pair for non-matching properties for the given two objects. */
export const diff = <T extends {}>(current: T, prev: T) => {
  const keys = [...new Set([...Object.keys(current), ...Object.keys(prev)])] as (keyof T)[];
  return keys.reduce((acc, key) => {
    const value = current[key];
    value !== prev[key] && acc.push([key as string, value]);
    return acc;
  }, new Array<[string, T[keyof T]]>());
};
