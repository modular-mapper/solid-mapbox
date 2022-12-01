import type { LngLatLike, PopupOptions } from "mapbox-gl";
import mapboxgl from "mapbox-gl";
import { createEffect, onCleanup, ParentProps } from "solid-js";
import { useMap } from "./map";

interface PopupProps extends ParentProps {
  options?: PopupOptions;
  lngLat: LngLatLike;
}

export function Popup(props: PopupProps) {
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
}
