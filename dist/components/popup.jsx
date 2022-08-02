import { onCleanup, createEffect } from "solid-js";
import { useMap } from "./map";
import mapboxgl from "mapbox-gl";
export const Popup = (props) => {
    const map = useMap();
    let popup;
    // Add Popup
    createEffect(() => {
        popup = new mapboxgl.Popup(props.options)
            .setLngLat(props.lngLat)
            .setDOMContent((<div>{props.children}</div>))
            .addTo(map());
    });
    // Remove Popup
    onCleanup(() => popup.remove());
    // Update Position
    createEffect(() => popup && popup.setLngLat(props.lngLat));
    // Update Content
    createEffect(() => popup && popup.setDOMContent((<div>{props.children}</div>)));
    return <></>;
};
