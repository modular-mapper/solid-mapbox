import { onCleanup, createEffect, createContext, useContext, createUniqueId, onMount, } from "solid-js";
import { useMap } from "./map";
const SourceContext = createContext("");
export const useSourceId = () => useContext(SourceContext);
const createSourceComponent = (type, handlers) => {
    return (props) => {
        const id = props.id || createUniqueId();
        const map = useMap();
        const sourceExists = () => map().getSource(id) !== undefined;
        const data = () => ({ ...props, type });
        // Add
        onMount(() => {
            handlers.onadd && handlers.onadd(data());
            if (type === "geojson")
                return;
            !sourceExists() && map().addSource(id, data());
        });
        // Update
        createEffect(() => {
            const source = map().getSource(id);
            source && handlers.onupdate && handlers.onupdate(data(), source);
        });
        // Remove
        onCleanup(() => {
            const source = map().getSource(id);
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
    Raster: createSourceComponent("raster", {
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
    Vector: createSourceComponent("vector", {
        onupdate: (config, src) => (config.url ? src.setUrl(config.url) : src.tiles && src.setTiles(src.tiles)),
    }),
    GeoJSON: createSourceComponent("geojson", {
        onupdate: (config, src) => config.data && src.setData(config.data),
    }),
};
