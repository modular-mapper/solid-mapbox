import { Component } from "solid-js";
import type { ImageSourceOptions } from "mapbox-gl";
export declare const Image: Component<{
    id: string;
    url?: string;
    image?: HTMLImageElement | ImageBitmap | ImageData | {
        width: number;
        height: number;
        data: Uint8Array | Uint8ClampedArray;
    };
    options?: ImageSourceOptions;
}>;
