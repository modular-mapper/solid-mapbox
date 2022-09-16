import { onCleanup, createEffect, createUniqueId, onMount, splitProps } from "solid-js";
import { useMap } from "./map";
import { useSourceId } from "./source";
import { diff, MappedEventHandlers } from "../utils";
import mapboxgl from "mapbox-gl";

type LayerEventHandlers = MappedEventHandlers<mapboxgl.MapLayerEventType>;

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type MapUnion<T, K extends keyof T> = T extends any ? PartialBy<T, K> : never;
type LayerType = mapboxgl.AnyLayer;

interface LayerProps extends Partial<LayerEventHandlers> {
  before?: string;
  featureState?: { id?: number | string; state: object };
  filter?: any[];
}

export const Layer = <T extends LayerType>(props: T & LayerProps) => {
  const [_, style] = splitProps(props, ["before", "featureState", "filter"]) as [any, T];
  const { map } = useMap();
  const source = useSourceId();
  const layerExists = () => map.getLayer(props.id) !== undefined;

  // Add Layer
  onMount(() => {
    if (layerExists()) return;

    map.addLayer(
      {
        ...style,
        id: props.id,
        source,
      } as mapboxgl.AnyLayer,
      props.before
    );
  });

  // Remove Layer
  onCleanup(() => layerExists() && map.removeLayer(props.id));

  // Hook up events
  createEffect(() => {
    (Object.keys(props).filter((key) => key.startsWith("on")) as (keyof LayerProps)[]).forEach((key) => {
      const event = key.slice(2).toLowerCase() as keyof mapboxgl.MapLayerEventType;
      const callback = props[key] as any;
      map.on(event, props.id, callback);
      onCleanup(() => map.off(event, props.id, callback));
    });
  });

  // Update Style
  createEffect((prev?: typeof style) => {
    if (!style || !map.getStyle() || !map.getSource(source) || !layerExists()) return;
    if (!prev) return style;

    if (style.type !== "custom" && prev.type !== "custom") {
      (["layout", "paint"] as (keyof typeof style)[]).forEach((target) => {
        if (style[target] && prev[target] && style[target] !== prev[target]) {
          diff(style[target], prev[target]).forEach(([key, value]) => map.setLayoutProperty(props.id, key, value));
        }
      });

      if (style.minzoom !== prev.minzoom || style.maxzoom !== prev.maxzoom) {
        map.setLayerZoomRange(props.id, style.minzoom ?? 0, style.maxzoom ?? 22);
      }
    }

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
    if (!props.filter) return;

    !map.isStyleLoaded() && (await map.once("styledata"));
    map.setFilter(props.id, props.filter);
  });

  // Update Feature State
  createEffect(async () => {
    if (!props.featureState || !props.featureState.id || source === "") return;

    // await style if necessary
    !map.isStyleLoaded() && (await map.once("styledata"));

    const sourceLayer = "source-layer" in props ? props["source-layer"] : undefined;

    map.removeFeatureState({ source, sourceLayer });
    map.setFeatureState(
      {
        source: source,
        sourceLayer,
        id: props.featureState.id,
      },
      props.featureState.state
    );
  });

  return <></>;
};
