import type MapboxGL from "mapbox-gl";
import { createContext, createEffect, onCleanup, onMount, ParentProps, useContext } from "solid-js";
import { useMap } from "./map";

type SourceProps = MapboxGL.AnySourceData & ParentProps & { id: string };

const DEFAULT_GEOJSON: MapboxGL.GeoJSONSourceRaw = {
  type: "geojson",
  data: {
    features: [],
    type: "FeatureCollection",
  },
};

const SourceContext = createContext("");
export const useSourceId = () => useContext(SourceContext);

export function Source(props: SourceProps) {
  const { map } = useMap();
  const sourceExists = () => map.getSource(props.id) !== undefined;

  // Add
  onMount(() => {
    const { children, ...args } = props;
    const data = props.type === "geojson" ? DEFAULT_GEOJSON : args;
    !sourceExists() && map.addSource(props.id, data);
  });

  // Update
  createEffect(() => {
    const impl = map.getSource(props.id);

    if (impl.type === "raster" && props.type === "raster") {
      // TODO
    }

    if (impl.type === "vector" && props.type === "vector") {
      props.url ? impl.setUrl(props.url) : props.tiles && impl.setTiles(props.tiles);
    }

    if (impl.type === "geojson" && props.type === "geojson") {
      props.data && impl.setData(props.data);
    }
  });

  // Remove
  onCleanup(() => {
    map
      .getStyle()
      .layers.forEach((layer) => layer.type !== "custom" && layer.source === props.id && map.removeLayer(layer.id));
    sourceExists() && map.removeSource(props.id);
  });

  return <SourceContext.Provider value={props.id}>{props.children}</SourceContext.Provider>;
}
