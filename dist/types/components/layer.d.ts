import { Component } from "solid-js";
import type MBX from "mapbox-gl";
declare type LayerImpl = MBX.RasterLayer | MBX.FillExtrusionLayer;
declare type LayerProps<T extends LayerImpl> = Omit<T, "type" | "id"> & {
    id?: string;
    before?: string;
    featureState?: {
        id: number | string;
        state: object;
    };
};
declare type LayerComponent<T extends LayerImpl> = Component<LayerProps<T>>;
export declare const Layer: {
    Raster: LayerComponent<MBX.RasterLayer>;
    FillExtrusion: LayerComponent<MBX.FillExtrusionLayer>;
};
export {};
