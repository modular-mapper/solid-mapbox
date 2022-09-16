import { onCleanup, createEffect, Component, onMount } from "solid-js";
import { useMap } from "./map";
import mapboxgl from "mapbox-gl";
import type { MarkerOptions, LngLatLike } from "mapbox-gl";

//TODO overhaul Marker system
/*
    <marker>
      {markerStuff}
      <popup>
        {popupStuff}
      </popup>
    </marker>
  */

interface MarkerProps {
  children?: Element;
  options?: Omit<MarkerOptions, "element">;
  lngLat: LngLatLike;
  popup?: Element;
  onDragStart?: mapboxgl.EventedListener;
  onDrag?: mapboxgl.EventedListener;
  onDragEnd?: mapboxgl.EventedListener;
}

export const Marker: Component<MarkerProps> = (props) => {
  const { map } = useMap();
  let marker: mapboxgl.Marker;

  // Add Marker
  onMount(() => {
    marker = new mapboxgl.Marker({ ...props.options, element: props.children as HTMLElement })
      .setLngLat(props.lngLat)
      .setPopup(props.popup ? new mapboxgl.Popup({ offset: 20 }).setDOMContent(props.popup as Node) : undefined)
      .addTo(map);
  });

  createEffect(() => {
    props.onDragStart && marker.on("dragstart", props.onDragStart);
    props.onDrag && marker.on("drag", props.onDrag);
    props.onDragEnd && marker.on("dragend", props.onDragEnd);
  });

  onCleanup(() => {
    props.onDragStart && marker.off("dragstart", props.onDragStart);
    props.onDrag && marker.off("drag", props.onDrag);
    props.onDragEnd && marker.off("dragend", props.onDragEnd);
    marker.remove();
  });

  // Update Position
  createEffect(() => marker && marker.setLngLat(props.lngLat));

  return <></>;
};
