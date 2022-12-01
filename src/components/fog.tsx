import type MapboxGL from "mapbox-gl";
import { createEffect, onCleanup } from "solid-js";
import { useMap } from "./map";

export const Fog = (props: MapboxGL.Fog) => {
  const { map } = useMap();

  // Add Fog Layer
  createEffect(() => map.setFog(props));

  // Remove Fog Layer
  onCleanup(() => map.setFog({}));

  // Update Visibility
  // createEffect(() => {
  //   props.visible !== undefined && map().setFog(props.visible ? props.style : {});
  // });

  return <></>;
};
