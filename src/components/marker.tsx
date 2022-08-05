import { onCleanup, createEffect, Component, createContext, useContext, createUniqueId } from "solid-js";
import { useMap } from "./map";
import mapboxgl from "mapbox-gl";
import type { MarkerOptions, LngLatLike } from "mapbox-gl";

export const Marker: Component<{
  options?: MarkerOptions;
  lngLat: LngLatLike;
  children?: any;
  popUp?: Element;
}> = (props) => {
  const map = useMap();
  let marker: mapboxgl.Marker;

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
    marker = new mapboxgl.Marker({...props.options, element: props.children})
      .setLngLat(props.lngLat)
      .setPopup(props.popUp ? new mapboxgl.Popup({offset: 20}).setDOMContent((props.popUp) as Node) : undefined)
      .addTo(map());
  });
  // Remove Marker
  onCleanup(() => marker.remove());

  // Update Position
  createEffect(() => marker && marker.setLngLat(props.lngLat));

  return <></>;
};
