import { onCleanup, createEffect } from "solid-js";
import { useMap } from "./map";
import mapboxgl from "mapbox-gl";
export const Marker = (props) => {
    const map = useMap();
    let marker;
    //TODO overhaul Marker system
    /*
      <marker>
        {markerStuff}
        <popup>
          {popupStuff}
        </popup>
      </marker>
    */
    // Add Marker
    createEffect(() => {
        marker = new mapboxgl.Marker({ ...props.options, element: props.children })
            .setLngLat(props.lngLat)
            .setPopup(props.popUp ? new mapboxgl.Popup({ offset: 20 }).setDOMContent((props.popUp)) : undefined)
            .addTo(map());
    });
    // Remove Marker
    onCleanup(() => marker.remove());
    // Update Position
    createEffect(() => marker && marker.setLngLat(props.lngLat));
    return <></>;
};
