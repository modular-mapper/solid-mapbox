import { Component, ParentProps } from "solid-js";
import type MBX from "mapbox-gl";
declare type SourceImpl = MBX.GeoJSONSourceRaw | MBX.VectorSource | MBX.RasterSource;
declare type SourceComponent<T extends SourceImpl> = Component<Omit<T, "type"> & ParentProps>;
export declare const useSourceId: () => string;
export declare const Source: {
    Raster: SourceComponent<MBX.RasterSource>;
    Vector: SourceComponent<MBX.VectorSource>;
    GeoJSON: SourceComponent<MBX.GeoJSONSourceRaw>;
};
export {};
