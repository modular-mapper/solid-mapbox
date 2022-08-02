import { onCleanup, createEffect, Component } from "solid-js";
import { useMap } from "./map";
import type MBX from "mapbox-gl";

export const Fog: Component<MBX.Fog> = (props) => {
  const map = useMap();

  // Add Fog Layer
  createEffect(() => map().setFog(props));

  // Remove Fog Layer
  onCleanup(() => map().setFog({}));

  // Update Visibility
  // createEffect(() => {
  //   props.visible !== undefined && map().setFog(props.visible ? props.style : {});
  // });

  return <></>;
};
