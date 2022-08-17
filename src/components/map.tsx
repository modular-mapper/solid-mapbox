import {
  createSignal,
  createEffect,
  onMount,
  onCleanup,
  createContext,
  useContext,
  createUniqueId,
  Accessor,
  Show,
  JSX,
} from "solid-js";
import mapboxgl from "mapbox-gl";
import { MappedEventHandlers } from "../utils";
import type { ComponentProps, Component } from "solid-js";
import "mapbox-gl/dist/mapbox-gl.css";

type TransitionType = "flyTo" | "easeTo" | "jumpTo";
type ContainerProps = "id" | "class" | "classList" | "ref" | "children";
type MapEventHandlers = MappedEventHandlers<mapboxgl.MapEventType>;

// interface MapOptions extends Omit<MBX.MapboxOptions, "container">, Partial<MapEventHandlers> {
//   style?: MapStyle;
// }

export interface MapProps extends Pick<ComponentProps<"div">, ContainerProps>, Partial<MapEventHandlers> {
  style?: ComponentProps<"div">["style"];
  /** Mapbox Options
   * @see https://docs.mapbox.com/mapbox-gl-js/api/map/#map-parameters
   */
  options?: Omit<mapboxgl.MapboxOptions, "container">;
  /** Mouse Cursor Style */
  cursorStyle?: string;
  /** Disable automatic map resize */
  disableResize?: boolean;
  /** Debug feature toggle */
  debug?: {
    tileBoundaries?: boolean;
    terrainWireframe?: boolean;
    padding?: boolean;
    collisionBoxes?: boolean;
    overdrawInspector?: boolean;
  };
}

const MapContext = createContext((() => {}) as Accessor<mapboxgl.Map>);
/** Provides the Mapbox Map Object */
export const useMap = () => useContext(MapContext);

/** Creates a new Map Container */
export const MapBox: Component<MapProps> = (props) => {
  props.id = props.id || createUniqueId();
  const [mapbox, setMapbox] = createSignal<mapboxgl.Map>();

  const debug = (text: string, value: unknown) => props.debug && console.debug(`${text}: %c${value}`, "color: #00F");

  let container!: HTMLDivElement;

  // const getStyle = (style: string | {}) => {
  // return typeof style === "string" || style instanceof String
  // ? style.split(":").reduce((p, c) => p[c], VECTOR_STYLES) || style
  // : style || { version: 8, sources: {}, layers: [] };
  // };

  onMount(() => {
    const map = new mapboxgl.Map({ ...props.options, container });
    map.once("load").then(() => setMapbox(map));

    // Listen to map container size changes
    const resizer = new ResizeObserver(() => map.resize());
    createEffect(() => (props.disableResize ? resizer.disconnect() : resizer.observe(container)));

    // Hook up events
    createEffect(() => {
      (Object.keys(props).filter((key) => key.startsWith("on")) as (keyof MapProps)[]).forEach((key) => {
        const event = key.slice(2).toLowerCase() as keyof mapboxgl.MapEventType;
        const callback = props[key] as any;
        props[key] !== undefined ? map.on(event, callback) : map.off(event, callback);
        onCleanup(() => map.off(event, callback));
      });
    });

    // Update debug features
    createEffect(() => {
      if (!props.debug) return;
      map.showTileBoundaries = props.debug.tileBoundaries ?? false;
      map.showTerrainWireframe = props.debug.terrainWireframe ?? false;
      map.showPadding = props.debug.padding ?? false;
      map.showCollisionBoxes = props.debug.collisionBoxes ?? false;
    });

    // Update cursor
    createEffect((prev) => {
      if (props.cursorStyle === prev || props.cursorStyle === undefined) return;
      debug("Update Cursor to", props.cursorStyle);
      map.getCanvas().style.cursor = props.cursorStyle;
      return props.cursorStyle;
    });

    // Update map style
    createEffect((prev) => {
      if (!props.options?.style) return;
      const style = props.options?.style;
      if (style === prev) return;

      let oldLayers: mapboxgl.AnyLayer[] = [];
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
  });

  return (
    <>
      <Show when={mapbox()}>
        <MapContext.Provider value={mapbox as Accessor<mapboxgl.Map>}>{props.children}</MapContext.Provider>
      </Show>
      <div
        ref={container}
        id={props.id}
        class={props.class}
        classList={props.classList}
        style={{ position: "absolute", inset: 0, ...(props.style as JSX.CSSProperties) }}
      />
    </>
  );
};
