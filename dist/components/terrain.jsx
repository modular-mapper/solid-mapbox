import { onCleanup, createEffect } from "solid-js";
import { useMap } from "./map";
import { useSourceId } from "./source";
export const Terrain = (props) => {
    const map = useMap();
    const sourceId = useSourceId();
    // Add Terrain Layer
    createEffect(() => map().setTerrain({ ...props.style, source: sourceId }));
    // Remove Terrain Layer
    onCleanup(() => map().setTerrain(undefined));
    // Update Visibility
    createEffect(() => {
        props.visible !== undefined && map().setTerrain(props.visible ? props.style : undefined);
    });
    return props.children;
};
