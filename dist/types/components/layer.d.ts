import mapboxgl from "mapbox-gl";
declare type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
declare type MapUnion<T, K extends keyof T> = T extends any ? PartialBy<T, K> : never;
declare type LayerType = MapUnion<mapboxgl.AnyLayer, "id">;
declare type LayerProps = {
    before?: string;
    featureState?: {
        id: number | string;
        state: object;
    };
};
export declare const Layer: <T extends LayerType>(props: T & LayerProps) => import("solid-js").JSX.Element;
export {};
