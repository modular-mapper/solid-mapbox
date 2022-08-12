import {
  onCleanup,
  createEffect,
  Component,
  createContext,
  useContext,
  createUniqueId,
  onMount,
  ParentProps,
} from "solid-js";
import { useMap } from "./map";
import type mapboxgl from "mapbox-gl";

const DEFAULT_GEOJSON: mapboxgl.GeoJSONSourceRaw = {
  type: "geojson",
  data: {
    features: [],
    type: "FeatureCollection",
  },
};

const SourceContext = createContext("");
export const useSourceId = () => useContext(SourceContext);

const Source: Component<mapboxgl.AnySourceData & ParentProps> = (props) => {
  const id = "id" in props && props.id ? props.id : createUniqueId();
  const map = useMap();
  const sourceExists = () => map().getSource(id) !== undefined;

  // Add
  onMount(() => {
    const { children, ...args } = props;
    const data = props.type === "geojson" ? DEFAULT_GEOJSON : args;
    !sourceExists() && map().addSource(id, data);
  });

  // Update
  createEffect(() => {
    const impl = map().getSource(id);

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
    map()
      .getStyle()
      .layers.forEach((layer) => layer.type !== "custom" && layer.source === id && map().removeLayer(layer.id));
    sourceExists() && map().removeSource(id);
  });

  return <SourceContext.Provider value={id}>{props.children}</SourceContext.Provider>;
};

export default Source;
