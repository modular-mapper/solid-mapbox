import { onCleanup, createEffect, createUniqueId, onMount, splitProps } from "solid-js";
import { useMap } from "./map";
import { useSourceId } from "./source";
const createLayerComponent = (type, handlers) => {
    return (props) => {
        const [_, style] = splitProps(props, ["before", "featureState"]);
        const id = props.id || createUniqueId();
        const map = useMap();
        const sourceId = useSourceId();
        const layerExists = () => map().getLayer(id) !== undefined;
        // Add Layer
        onMount(() => {
            map().addLayer({
                ...style,
                source: sourceId,
                type,
                id,
                metadata: {
                    smg: { beforeId: props.before },
                },
            }, props.before);
        });
        // Remove Layer
        onCleanup(() => layerExists() && map().removeLayer(id));
        // Hook up events
        // createEffect(() =>
        //   layerEvents.forEach((item) => {
        //     if (props[item]) {
        //       const event = item.slice(2).toLowerCase();
        //       const callback = (e) => props[item](e);
        //       map()?.on(event, props.id, callback);
        //       onCleanup(() => map()?.off(event, props.id, callback));
        //     }
        //   })
        // );
        // Update Style
        createEffect((prev) => {
            if (!style || !map().getStyle() || !map().getSource(sourceId) || !layerExists())
                return;
            if (!prev)
                return style;
            ["layout", "paint"].forEach((target) => {
                if (style[target] && prev[target] && style[target] !== prev[target]) {
                    diff(style[target], prev[target]).forEach(([key, value]) => map().setLayoutProperty(id, key, value));
                }
            });
            if (style.minzoom && style.maxzoom && (style.minzoom !== prev.minzoom || style.maxzoom !== prev.maxzoom)) {
                map().setLayerZoomRange(id, style.minzoom, style.maxzoom);
            }
            if (style.filter !== prev.filter)
                map().setFilter(id, style.filter, { validate: false });
            return style;
        }, style);
        // Update Visibility
        // createEffect((prev: boolean) => {
        //   if (props.visible === undefined || props.visible === prev || !map().getSource(sourceId) || !layerExists()) return;
        //   map().setLayoutProperty(props.id, "visibility", props.visible ? "visible" : "none", { validate: false });
        //   return props.visible;
        // }, props.visible);
        // Update Filter
        createEffect(async () => {
            if (!props.filter)
                return;
            !map().isStyleLoaded() && (await map().once("styledata"));
            map().setFilter(id, props.filter);
        });
        // Update Feature State
        createEffect(async () => {
            if (!props.featureState || !props.featureState.id)
                return;
            !map().isStyleLoaded() && (await map().once("styledata"));
            map().removeFeatureState({
                source: sourceId,
                sourceLayer: props["source-layer"],
            });
            map().setFeatureState({
                source: sourceId,
                sourceLayer: props["source-layer"],
                id: props.featureState.id,
            }, props.featureState.state);
        });
        return <></>;
    };
};
const diff = (current, prev) => {
    const keys = [...new Set([...Object.keys(current), ...Object.keys(prev)])];
    return keys.reduce((acc, key) => {
        const value = current[key];
        value !== prev[key] && acc.push([key, value]);
        return acc;
    }, new Array());
};
export const Layer = {
    Raster: createLayerComponent("raster", {}),
    FillExtrusion: createLayerComponent("fill-extrusion", {}),
};
