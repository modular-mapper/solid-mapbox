import { onCleanup, createEffect, Component, createUniqueId, onMount, ParentProps, splitProps } from "solid-js";
import { useMap } from "./map";
import { useSourceId } from "./source";
import { MappedEventHandlers } from "../utils";
import type MBX from "mapbox-gl";

type LayerEventHandlers = MappedEventHandlers<MBX.MapLayerEventType>;
type LayerType =
  | "background"
  | "fill"
  | "line"
  | "symbol"
  | "raster"
  | "circle"
  | "fill-extrusion"
  | "heatmap"
  | "hillshade"
  | "sky";

type LayerImpl = MBX.RasterLayer | MBX.FillExtrusionLayer;
type LayerProps<T extends LayerImpl> = Omit<T, "type" | "id"> & {
  id?: string;
  before?: string;
  featureState?: { id: number | string; state: object };
};
type LayerComponent<T extends LayerImpl> = Component<LayerProps<T>>;

const createLayerComponent = <T extends LayerImpl>(
  type: "raster" | "fill-extrusion",
  handlers: {
    onadd?: (source: T) => void;
    onupdate?: (source: T) => void;
    onremove?: (source: T) => void;
  }
): LayerComponent<T> => {
  return (props) => {
    const [_, style] = splitProps(props, ["before", "featureState"]);
    const id = props.id || createUniqueId();
    const map = useMap();
    const sourceId = useSourceId();
    const layerExists = () => map().getLayer(id) !== undefined;

    // Add Layer
    onMount(() => {
      map().addLayer(
        {
          ...style,
          source: sourceId,
          type,
          id,
          metadata: {
            smg: { beforeId: props.before },
          },
        } as MBX.AnyLayer,
        props.before
      );
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
    createEffect((prev?: typeof style) => {
      if (!style || !map().getStyle() || !map().getSource(sourceId) || !layerExists()) return;
      if (!prev) return style;

      (["layout", "paint"] as (keyof typeof style)[]).forEach((target) => {
        if (style[target] && prev[target] && style[target] !== prev[target]) {
          diff(style[target], prev[target]).forEach(([key, value]) => map().setLayoutProperty(id, key, value));
        }
      });

      if (style.minzoom && style.maxzoom && (style.minzoom !== prev.minzoom || style.maxzoom !== prev.maxzoom)) {
        map().setLayerZoomRange(id, style.minzoom, style.maxzoom);
      }

      if (style.filter !== prev.filter) map().setFilter(id, style.filter, { validate: false });

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

      !map().isStyleLoaded() && (await map().once("styledata"));
      map().setFilter(id, props.filter);
    });

    // Update Feature State
    createEffect(async () => {
      if (!props.featureState || !props.featureState.id) return;

      !map().isStyleLoaded() && (await map().once("styledata"));

      map().removeFeatureState({
        source: sourceId,
        sourceLayer: props["source-layer"],
      });

      map().setFeatureState(
        {
          source: sourceId,
          sourceLayer: props["source-layer"],
          id: props.featureState.id,
        },
        props.featureState.state
      );
    });

    return <></>;
  };
};

const diff = <T,>(current: T, prev: T) => {
  const keys = [...new Set([...Object.keys(current), ...Object.keys(prev)])] as (keyof T)[];
  return keys.reduce((acc, key) => {
    const value = current[key];
    value !== prev[key] && acc.push([key as string, value]);
    return acc;
  }, new Array<[string, T[keyof T]]>());
};

export const Layer = {
  Raster: createLayerComponent<MBX.RasterLayer>("raster", {}),
  FillExtrusion: createLayerComponent<MBX.FillExtrusionLayer>("fill-extrusion", {}),
};
