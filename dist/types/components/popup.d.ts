import { Component } from "solid-js";
import type { PopupOptions, LngLatLike } from "mapbox-gl";
export declare const Popup: Component<{
    options?: PopupOptions;
    lngLat: LngLatLike;
    children?: any;
}>;
