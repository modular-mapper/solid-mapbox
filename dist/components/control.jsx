import { onCleanup, onMount } from "solid-js";
import { useMap } from "./map";
import MBX from "mapbox-gl";
const CONTROLS = {
    attribution: MBX.AttributionControl,
    fullscreen: MBX.FullscreenControl,
    geolocate: MBX.GeolocateControl,
    navigation: MBX.NavigationControl,
    scale: MBX.ScaleControl,
};
const createControl = (type) => {
    return (props) => {
        const map = useMap();
        const control = new CONTROLS[type]();
        // Add Control
        onMount(() => map().addControl(control, props.position));
        // Remove Control
        onCleanup(() => map().removeControl(control));
        return props.children;
    };
};
export const Control = {
    Attribution: createControl("attribution"),
    Navigation: createControl("navigation"),
    Fullscreen: createControl("fullscreen"),
    Geolocate: createControl("geolocate"),
    Scale: createControl("scale"),
};
