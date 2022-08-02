import { onCleanup, createEffect, Component } from "solid-js";
import { useMap } from "./map";
import mapboxgl from "mapbox-gl";
import type { MarkerOptions, LngLatLike } from "mapbox-gl";

export const Marker: Component<{
  options?: MarkerOptions;
  lngLat: LngLatLike;
  children?: any;
}> = (props) => {
  const map = useMap();
  let marker: mapboxgl.Marker;

  // Add Marker
  createEffect(() => {
    marker = new mapboxgl.Marker(props.options)
      .setLngLat(props.lngLat)
      .setPopup(props.children ? new mapboxgl.Popup().setDOMContent((<div>{props.children}</div>) as Node) : undefined)
      .addTo(map());
  });
  // Remove Marker
  onCleanup(() => marker.remove());

  // Update Position
  createEffect(() => marker && marker.setLngLat(props.lngLat));

  return <></>;
};
