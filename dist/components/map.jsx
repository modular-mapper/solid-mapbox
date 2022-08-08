import { createSignal, createEffect, onMount, onCleanup, createContext, useContext, createUniqueId, untrack, Show, } from "solid-js";
import MBX from "mapbox-gl";
const MapContext = createContext((() => { }));
/** Provides the Mapbox Map Object */
export const useMap = () => useContext(MapContext);
/** Creates a new Map Container */
export const MapBox = (props) => {
    props.id = props.id || createUniqueId();
    const [mapbox, setMapbox] = createSignal();
    const [transitionType, setTransitionType] = createSignal("flyTo");
    const debug = (text, value) => props.debug && console.debug(`${text}: %c${value}`, "color: #00F");
    let container;
    // const getStyle = (style: string | {}) => {
    // return typeof style === "string" || style instanceof String
    // ? style.split(":").reduce((p, c) => p[c], VECTOR_STYLES) || style
    // : style || { version: 8, sources: {}, layers: [] };
    // };
    onMount(() => {
        const map = new MBX.Map({
            ...props.options,
            ...props.viewport,
            container,
            interactive: !!props.onViewportChange,
            // fitBoundsOptions: { padding: props.viewport?.padding },
        });
        map.once("load").then(() => setMapbox(map));
        // onCleanup(() => map.remove());
        // Listen to map container size changes
        const resizeObserver = new ResizeObserver(() => map.resize());
        createEffect(() => props.disableResize ? resizeObserver.disconnect() : resizeObserver.observe(container));
        // Hook up events
        createEffect(() => {
            Object.keys(props).filter((key) => key.startsWith("on")).forEach((key) => {
                const event = key.slice(2).toLowerCase();
                const callback = props[key];
                map.on(event, callback);
                onCleanup(() => map.off(event, callback));
            });
        });
        // Update debug features
        createEffect(() => {
            map.showTileBoundaries = props.showTileBoundaries ?? false;
            map.showTerrainWireframe = props.showTerrainWireframe ?? false;
            map.showPadding = props.showPadding ?? false;
            map.showCollisionBoxes = props.showCollisionBoxes ?? false;
        });
        // Update cursor
        createEffect((prev) => {
            if (props.cursorStyle === prev)
                return;
            debug("Update Cursor to", props.cursorStyle);
            map.getCanvas().style.cursor = props.cursorStyle;
            return props.cursorStyle;
        });
        //Update transition type
        createEffect((prev) => {
            if (props.transitionType === prev)
                return;
            debug("Update Transition to", props.transitionType);
            setTransitionType(props.transitionType);
            return props.transitionType;
        });
        // Update projection
        createEffect((prev) => {
            if (props.options?.projection === prev || !props.options?.projection)
                return;
            debug("Update Projection to", props.options.projection.name);
            map.setProjection(props.options.projection);
            return props.options.projection;
        });
        // Update map style
        createEffect((prev) => {
            if (!props.options?.style)
                return;
            const style = props.options?.style;
            if (style === prev)
                return;
            let oldLayers = [];
            let oldSources = {};
            debug("Update Mapstyle to", style);
            if (map.isStyleLoaded()) {
                const oldStyle = map.getStyle();
                oldLayers = oldStyle.layers.filter((l) => l.id.startsWith("cl-"));
                oldSources = Object.keys(oldStyle.sources)
                    .filter((s) => s.startsWith("cl-"))
                    .reduce((obj, key) => ({ ...obj, [key]: oldStyle.sources[key] }), {});
            }
            map.setStyle(style);
            map.once("styledata", () => {
                const newStyle = map.getStyle();
                map.setStyle({
                    ...newStyle,
                    sources: { ...newStyle.sources, ...oldSources },
                    layers: [...newStyle.layers, ...oldLayers],
                });
            });
            return style;
        }, props.options?.style);
        // Hook up viewport events
        createEffect(() => {
            const viewport = {
                id: undefined,
                center: map.getCenter(),
                zoom: map.getZoom(),
                pitch: map.getPitch(),
                bearing: map.getBearing(),
                // padding: props.viewport.padding,
                bounds: props.viewport.bounds,
            };
            const onMove = (event) => {
                if (event.originalEvent)
                    props.onViewportChange && props.onViewportChange({ ...viewport, id: props.id });
                setTransitionType("jumpTo");
            };
            const onMoveEnd = (event) => {
                if (event.originalEvent)
                    props.onViewportChange && props.onViewportChange(viewport);
                if (props.transitionType)
                    setTransitionType(props.transitionType);
            };
            map.on("move", onMove).on("moveend", onMoveEnd);
            onCleanup(() => map.off("move", onMove).off("moveend", onMoveEnd));
        });
        // Update boundaries
        createEffect((prev) => {
            if (props.viewport?.bounds && props.viewport?.bounds != prev && props.onViewportChange)
                props.onViewportChange({
                    ...props.viewport,
                    ...map.cameraForBounds(props.viewport.bounds, {
                    // padding: props.viewport.padding,
                    }),
                });
            return props.viewport?.bounds;
        }, props.viewport?.bounds);
        // Update Viewport
        createEffect(() => {
            if (props.id === props.viewport?.id)
                return;
            map.stop()[untrack(transitionType)](props.viewport);
        });
    });
    return (<>
      <Show when={mapbox()}>
        <MapContext.Provider value={mapbox}>
          <div style={{ position: "relative", "z-index": 10 }}>{props.children}</div>
        </MapContext.Provider>
      </Show>
      <div ref={container} id={props.id} class={props.class} classList={props.classList} style={{ position: "absolute", inset: 0, ...props.style }}/>
    </>);
};
