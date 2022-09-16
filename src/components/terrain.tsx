import { onCleanup, createEffect, Component } from "solid-js";
import { useMap } from "./map";
import { useSourceId } from "./source";
import { TerrainSpecification } from "mapbox-gl";

export const Terrain: Component<{
  style: TerrainSpecification;
  visible?: boolean;
  children?: any;
}> = (props) => {
  const { map } = useMap();
  const sourceId = useSourceId();

  // Add Terrain Layer
  createEffect(() => map.setTerrain({ ...props.style, source: sourceId }));

  // Remove Terrain Layer
  onCleanup(() => map.setTerrain(undefined));

  // Update Visibility
  createEffect(() => {
    props.visible !== undefined && map.setTerrain(props.visible ? props.style : undefined);
  });

  return props.children;
};
