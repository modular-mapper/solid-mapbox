import type MBX from "mapbox-gl";
import { createEffect, onCleanup, onMount } from "solid-js";
import { useMap } from "./map";

type SkyProps = Omit<MBX.SkyLayer, "id" | "type">;

const LAYER_ID = "sky";

export function Sky(props: SkyProps) {
  const { map } = useMap();
  const layerExists = () => map.getLayer(LAYER_ID) !== undefined;

  // Add Sky Layer
  onMount(() => !layerExists() && map.addLayer({ id: LAYER_ID, type: "sky", ...props }));

  // Remove Sky Layer
  onCleanup(() => layerExists() && map.removeLayer(LAYER_ID));

  // Update Visibility
  createEffect(() => {
    // map().setPaintProperty()
    // props.visible !== undefined && map().setLayoutProperty(LAYER_ID, "visibility", props.visible ? "visible" : "none");
  });

  return <></>;
}
