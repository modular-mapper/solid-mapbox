import { onCleanup, createEffect, Component } from "solid-js";
import { useMap } from "./map";
import mapboxgl from "mapbox-gl";
import type { PopupOptions, LngLatLike } from "mapbox-gl";

export const Popup: Component<{
  options?: PopupOptions;
  lngLat: LngLatLike;
  children?: any;
}> = (props) => {
  const { map } = useMap();
  let popup: mapboxgl.Popup;

  // Add Popup
  createEffect(() => {
    popup = new mapboxgl.Popup(props.options)
      .setLngLat(props.lngLat)
      .setDOMContent((<div>{props.children}</div>) as Node)
      .addTo(map);
  });

  // Remove Popup
  onCleanup(() => popup.remove());

  // Update Position
  createEffect(() => popup && popup.setLngLat(props.lngLat));

  // Update Content
  createEffect(() => popup && popup.setDOMContent((<div>{props.children}</div>) as Node));

  return <></>;
};
