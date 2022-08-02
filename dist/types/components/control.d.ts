import { Component, ParentProps } from "solid-js";
import MBX from "mapbox-gl";
declare const CONTROLS: {
    attribution: typeof MBX.AttributionControl;
    fullscreen: typeof MBX.FullscreenControl;
    geolocate: typeof MBX.GeolocateControl;
    navigation: typeof MBX.NavigationControl;
    scale: typeof MBX.ScaleControl;
};
declare type ControlType = keyof typeof CONTROLS;
interface ControlProps<T extends ControlType> extends ParentProps {
    options?: ConstructorParameters<typeof CONTROLS[T]>[0];
    position?: Parameters<MBX.Map["addControl"]>[1];
}
declare type ControlComponent<T extends ControlType> = Component<ControlProps<T>>;
export declare const Control: {
    Attribution: ControlComponent<"navigation" | "scale" | "attribution" | "fullscreen" | "geolocate">;
    Navigation: ControlComponent<"navigation" | "scale" | "attribution" | "fullscreen" | "geolocate">;
    Fullscreen: ControlComponent<"navigation" | "scale" | "attribution" | "fullscreen" | "geolocate">;
    Geolocate: ControlComponent<"navigation" | "scale" | "attribution" | "fullscreen" | "geolocate">;
    Scale: ControlComponent<"navigation" | "scale" | "attribution" | "fullscreen" | "geolocate">;
};
export {};
