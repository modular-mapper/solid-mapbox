import { Component, ParentProps } from "solid-js";
import type mapboxgl from "mapbox-gl";
declare type SourceImpl = mapboxgl.GeoJSONSourceRaw | mapboxgl.VectorSource | mapboxgl.RasterSource;
declare type SourceComponent<T extends SourceImpl> = Component<Omit<T, "type"> & ParentProps>;
export declare const useSourceId: () => string;
export declare const Source: {
    Raster: SourceComponent<mapboxgl.RasterSource>;
    Vector: SourceComponent<mapboxgl.VectorSource>;
    GeoJSON: SourceComponent<mapboxgl.GeoJSONSourceRaw>;
};
export {};
