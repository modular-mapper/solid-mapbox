/** Prepends a type segment to a type. */
export declare type Prefix<T extends string, V extends string> = T extends "" ? "" : `${V}${T}`;
/** Prepends a type segment to each key in an object type. */
export declare type MappedEventHandlers<T extends Record<string, unknown>> = {
    [K in keyof T as K extends string ? `on${K}` : never]: (event: T[K]) => void;
};
/** Flattens */
export declare type NestedKeys<T> = (T extends object ? {
    [K in Exclude<keyof T, symbol>]: `${K}${Prefix<NestedKeys<T[K]>, ":">}`;
}[Exclude<keyof T, symbol>] : "") extends infer D ? Extract<D, string> : never;
