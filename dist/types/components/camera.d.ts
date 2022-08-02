import { Component } from "solid-js";
import type { LngLatLike } from "mapbox-gl";
export declare const Camera: Component<{
    animate: boolean;
    translate?: {
        type?: "line" | "sphere";
        start: [number, number, number];
        end: [number, number, number];
        target: LngLatLike;
        targetEnd?: LngLatLike;
        easing?: "in" | "out" | "inOut";
        loop?: boolean;
        duration: number;
    };
    children?: any;
}>;
