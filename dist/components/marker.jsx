import { onCleanup, createEffect } from "solid-js";
import { useMap } from "./map";
import mapboxgl from "mapbox-gl";
export const Marker = (props) => {
    const map = useMap();
    let marker;
    // Add Marker
    createEffect(() => {
        marker = new mapboxgl.Marker(props.options)
            .setLngLat(props.lngLat)
            .setPopup(props.children ? new mapboxgl.Popup().setDOMContent((<div>{props.children}</div>)) : undefined)
            .addTo(map());
    });
    // Remove Marker
    onCleanup(() => marker.remove());
    // Update Position
    createEffect(() => marker && marker.setLngLat(props.lngLat));
    return <></>;
};
