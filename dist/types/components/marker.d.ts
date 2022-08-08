import { Component } from "solid-js";
import type { MarkerOptions, LngLatLike } from "mapbox-gl";
export declare const Marker: Component<{
    options?: MarkerOptions;
    lngLat: LngLatLike;
    children?: any;
    popUp?: Element;
}>;
