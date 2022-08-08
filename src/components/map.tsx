import {
  createSignal,
  createEffect,
  onMount,
  onCleanup,
  createContext,
  useContext,
  createUniqueId,
  untrack,
  Accessor,
  Show,
} from "solid-js";
import MBX from "mapbox-gl";
import { MappedEventHandlers } from "../utils";
import type { ComponentProps, Component } from "solid-js";
// import "mapbox-gl/dist/mapbox-gl.css";

type TransitionType = "flyTo" | "easeTo" | "jumpTo";
type ContainerProps = "id" | "class" | "classList" | "ref" | "children";
type MapEventHandlers = MappedEventHandlers<MBX.MapEventType>;

export type Viewport = {
  id?: string;
  center?: MBX.LngLatLike;
  bounds?: MBX.LngLatBounds;
  zoom?: number;
  pitch?: number;
  bearing?: number;
};

// interface MapOptions extends Omit<MBX.MapboxOptions, "container">, Partial<MapEventHandlers> {
//   style?: MapStyle;
// }

export interface MapProps extends Pick<ComponentProps<"div">, ContainerProps>, Partial<MapEventHandlers> {
  style?: ComponentProps<"div">["style"];
  /** Current Map View */
  viewport: Viewport;
  /** Mapbox Options
   * @see https://docs.mapbox.com/mapbox-gl-js/api/map/#map-parameters
   */
  options?: Omit<MBX.MapboxOptions, "container">;
  /** Type for pan, move and zoom transitions */
  transitionType?: TransitionType;
  /** Event listener for Viewport updates */
  onViewportChange?: (viewport: Viewport) => void;
  /** Displays Map Tile Borders */
  showTileBoundaries?: boolean;
  /** Displays Wireframe if Terrain is visible */
  showTerrainWireframe?: boolean;
  /** Displays Borders if Padding is set */
  showPadding?: boolean;
  /** Displays Label Collision Boxes */
  showCollisionBoxes?: boolean;
  /** Displays all feature outlines even if normally not drawn by style rules */
  showOverdrawInspector?: boolean;
  /** Mouse Cursor Style */
  cursorStyle?: string;
  /** Dark Map Style */
  darkStyle?: MBX.StyleOptions | string;
  /** Disable automatic map resize */
  disableResize?: boolean;
  /** Debug Mode */
  debug?: boolean;
}

const MapContext = createContext((() => {}) as Accessor<MBX.Map>);
/** Provides the Mapbox Map Object */
export const useMap = () => useContext(MapContext);

/** Creates a new Map Container */
export const MapBox: Component<MapProps> = (props) => {
  props.id = props.id || createUniqueId();
  const [mapbox, setMapbox] = createSignal<MBX.Map>();
  const [transitionType, setTransitionType] = createSignal<TransitionType>("flyTo");

  const debug = (text: string, value: unknown) => props.debug && console.debug(`${text}: %c${value}`, "color: #00F");

  let container!: HTMLDivElement;

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
    createEffect(() =>
      props.disableResize ? resizeObserver.disconnect() : resizeObserver.observe(container as Element)
    );

    // Hook up events
    createEffect(() => {
      (Object.keys(props).filter((key) => key.startsWith("on")) as (keyof MapProps)[]).forEach((key) => {
        const event = key.slice(2).toLowerCase() as keyof MBX.MapEventType;
        const callback = props[key] as MBX.MapEventType[typeof event];
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
      if (props.cursorStyle === prev) return;
      debug("Update Cursor to", props.cursorStyle);
      map.getCanvas().style.cursor = props.cursorStyle;
      return props.cursorStyle;
    });

    //Update transition type
    createEffect((prev) => {
      if (props.transitionType === prev) return;
      debug("Update Transition to", props.transitionType);
      setTransitionType(props.transitionType);
      return props.transitionType;
    });

    // Update projection
    createEffect((prev?: MBX.MapboxOptions["projection"]) => {
      if (props.options?.projection === prev || !props.options?.projection) return;
      debug("Update Projection to", props.options.projection.name);
      map.setProjection(props.options.projection);
      return props.options.projection;
    });

    // Update map style
    createEffect((prev) => {
      if (!props.options?.style) return;
      const style = props.options?.style;
      if (style === prev) return;

      let oldLayers: MBX.AnyLayer[] = [];
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
      const viewport: Viewport = {
        id: undefined,
        center: map.getCenter(),
        zoom: map.getZoom(),
        pitch: map.getPitch(),
        bearing: map.getBearing(),
        // padding: props.viewport.padding,
        bounds: props.viewport.bounds,
      };

      const onMove = (event: MBX.MapboxEvent) => {
        if (event.originalEvent) props.onViewportChange && props.onViewportChange({ ...viewport, id: props.id });
        setTransitionType("jumpTo");
      };

      const onMoveEnd = (event: MBX.MapboxEvent) => {
        if (event.originalEvent) props.onViewportChange && props.onViewportChange(viewport);
        if (props.transitionType) setTransitionType(props.transitionType);
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
      if (props.id === props.viewport?.id) return;
      map.stop()[untrack(transitionType)](props.viewport);
    });
  });

  return (
    <>
      <Show when={mapbox()}>
        <MapContext.Provider value={mapbox as Accessor<MBX.Map>}>
          <div style={{ position: "relative", "z-index": 10, width: "100%", height: "100%" }}>{props.children}</div>
        </MapContext.Provider>
      </Show>
      <div
        ref={container}
        id={props.id}
        class={props.class}
        classList={props.classList}
        style={{ position: "absolute", inset: 0, ...props.style }}
      />
    </>
  );
};
