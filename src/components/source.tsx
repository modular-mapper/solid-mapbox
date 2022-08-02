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
import type MBX from "mapbox-gl";

type SourceImpl = MBX.GeoJSONSourceRaw | MBX.VectorSource | MBX.RasterSource;
type SourceComponent<T extends SourceImpl> = Component<Omit<T, "type"> & ParentProps>;

const SourceContext = createContext("");
export const useSourceId = () => useContext(SourceContext);

const createSourceComponent = <T extends SourceImpl, I extends MBX.AnySourceData = T>(
  type: "raster" | "geojson" | "vector",
  handlers: {
    onadd?: (data: T) => void;
    onupdate?: (data: T, src: I) => void;
    onremove?: (data: T, src: I) => void;
  }
): SourceComponent<T> => {
  return (props) => {
    const id = props.id || createUniqueId();
    const map = useMap();
    const sourceExists = () => map().getSource(id) !== undefined;
    const data = () => ({ ...props, type } as T);

    // Add
    onMount(() => {
      handlers.onadd && handlers.onadd(data());
      if (type === "geojson") return;
      !sourceExists() && map().addSource(id, data());
    });

    // Update
    createEffect(() => {
      const source = map().getSource(id) as I;
      source && handlers.onupdate && handlers.onupdate(data(), source);
    });

    // Remove
    onCleanup(() => {
      const source = map().getSource(id) as I;
      handlers.onremove && handlers.onremove(data(), source);
      map()
        .getStyle()
        .layers.forEach((layer) => layer.type !== "custom" && layer.source === id && map().removeLayer(layer.id));
      sourceExists() && map().removeSource(id);
    });

    return <SourceContext.Provider value={id}>{props.children}</SourceContext.Provider>;
  };
};

export const Source = {
  Raster: createSourceComponent<MBX.RasterSource>("raster", {
    onupdate(src) {
      if (src.url || src.tiles) {
        // src.tiles && (src.tiles = ["a", "b", "c"].map((i) => src.tiles[0].replace("{s}", i)));
        // src._tileJSONRequest?.cancel();
        // src._options = { ...src._options, ...src };
        // src.load();
        // map().style._sourceCaches[`other:${src.id}`]?.clearTiles();
      }
    },
  }),

  Vector: createSourceComponent<MBX.VectorSource, MBX.VectorSourceImpl>("vector", {
    onupdate: (config, src) => (config.url ? src.setUrl(config.url) : src.tiles && src.setTiles(src.tiles)),
  }),

  GeoJSON: createSourceComponent<MBX.GeoJSONSourceRaw, MBX.GeoJSONSource>("geojson", {
    onupdate: (config, src) => config.data && src.setData(config.data),
  }),
};
